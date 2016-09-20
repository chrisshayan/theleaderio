import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {FlowRouter} from 'meteor/kadira:flow-router';

// logger
import {Logger} from '/imports/api/logger/index';

// collections
import {
  MUsers,
  MProfiles,
  MIndustries,
  MRelationships,
  MSurveys,
  MFeedbacks
} from './collections';
import {Profiles, STATUS_ACTIVE, STATUS_INACTIVE} from '/imports/api/profiles/index';
import {Organizations} from '/imports/api/organizations/index';
import {Industries} from '/imports/api/industries/index';
import {Employees} from '/imports/api/employees/index';
import {Metrics} from '/imports/api/metrics/index';
import {Feedbacks} from'/imports/api/feedbacks/index';
import {Tokens} from '/imports/api/tokens/index';

// methods
import * as TokenActions from '/imports/api/tokens/methods';
import * as EmailActions from '/imports/api/email/methods';
import {measureMonthlyMetricScore} from '/imports/api/measures/methods';

// constants
import {DEFAULT_PROFILE_PHOTO, DEFAULT_ORGANIZATION_PHOTO} from '/imports/utils/defaults';

/**
 * Function get list of migrated users and migrate their data one by one
 */
export const migrate = () => {
  const
    users = MUsers.find({roles: "leader"}, {fields: {_id: true}}).fetch()
    ;
  let count = 0;

  // migrate users data
  users.map(user => {
    migrateUserData({params: {oldUserId: user._id}});
    count++;
  });
  Logger.info(`migrated users: ${count}`);
  return count;
};

/**
 * Function collect and migrate data for a user
 * @param params
 * @param params.oldUserId - userId of the old data
 */
export const migrateUserData = ({params}) => {
  if (typeof params.oldUserId === 'undefined') {
    return;
  }
  const
    DOMAIN = Meteor.settings.public.domain,
    {oldUserId} = params,
    checkExists = {
      user: false,
      profile: false,
      org: false,
    },
    newAccount = {
      userId: "",
      profileId: "",
      alias: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      timezone: Meteor.settings.public.localTimezone,
      industries: [],
      imageUrl: DEFAULT_PROFILE_PHOTO
    },
    newOrg = {
      organizationId: "",
      name: "Unnamed",
      leaderId: "",
      employees: [],
      imageUrl: DEFAULT_ORGANIZATION_PHOTO
    },
    newEmployee = {
      employeeId: "",
      email: "",
      firstName: "",
      lastName: "",
      organizationId: "",
      leaderId: "",
      noOfEmployees: 0
    },
    newMetric = {
      metricId: "",
      planId: "migration",
      leaderId: "",
      organizationId: "",
      employeeId: "",
      metric: "",
      score: 0,
      date: new Date(),
      noOfMetrics: 0
    },
    newFeedback = {
      feedbackId: "",
      planId: "migration",
      leaderId: "",
      organizationId: "",
      employeeId: "",
      metric: "leadership",
      feedback: "",
      date: new Date(),
      noOfFeedback: 0
    },
    metricsName = {
      goalRating: "purpose",
      meetingRating: "mettings",
      groundRulesRating: "rules",
      communicationRating: "communications",
      leadershipRating: "leadership",
      workloadRating: "workload",
      energyRating: "energy",
      stressRating: "stress",
      decisionRating: "decision",
      respectRating: "respect",
      conflictRating: "conflict"
    },
    user = MUsers.findOne({_id: oldUserId}),
    profile = MProfiles.findOne({userId: oldUserId}),
    employees = MRelationships.find({userId: oldUserId, type: 1}, {fields: {elseId: true}}).fetch(),
    surveys = MSurveys.find({leaderId: oldUserId}).fetch(),
    feedbacks = MFeedbacks.find({leaderId: oldUserId}).fetch(),
    report = {
      oldUserId: "",
      newUserId: "",
      organizationId: "",
      noOfEmployees: 0,
      noOfMetrics: 0,
      noOfFeedback: 0
    }
    ;
  let
    oldEmployee = {},
    employee = {},
    oldEmployeeEmail = "",
    oldEmployeeId = "",
    newEmployeeId = "",
    haveData = 0,
    query = {},
    measureDate = new Date()
    ;

  // get new account info
  newAccount.email = user.emails[0].address;
  // Merge account for special user
  if (newAccount.email === "hamedshayan@gmail.com") {
    newAccount.email = "christopher.shayan@gmail.com";
  }
  newAccount.password = user.services.password.bcrypt;
  newAccount.firstName = profile.firstName;
  newAccount.lastName = profile.lastName;
  // newAccount.industries = profile.industries;
  profile.industries.map(industryId => {
    const
      industryName = MIndustries.findOne({_id: industryId}).name,
      newIndustryId = Industries.findOne({name: industryName})._id
      ;
    newAccount.industries.push(newIndustryId);
  });

  /**
   * Function create new account
   * @param {Object} newAccount
   * @return {String} newAccount.userId
   */

  query = {
    emails: {$elemMatch: {address: newAccount.email}}
  };
  haveData = Accounts.users.find(query).count();
  if (haveData === 0) {
    newAccount.userId = Accounts.createUser({
      email: newAccount.email,
      password: newAccount.password
    });
    Accounts.users.update({_id: newAccount.userId}, {$set: {"services.password.bcrypt": newAccount.password}});
    Logger.info(`Created new account - userId: ${newAccount.userId}`);
  } else {
    newAccount.userId = Accounts.users.findOne(query)._id;
    haveData = 0;
    checkExists.user = true;
    Logger.warn(`Account exists - userId: ${newAccount.userId}`);
  }
  if (!checkExists.user) {
    imageUrl = DEFAULT_PROFILE_PHOTO;
    query = {userId: newAccount.userId};
    haveData = Profiles.find(query).count();
    if (haveData === 0) {
      newAccount.profileId = Profiles.insert({
        userId: newAccount.userId,
        firstName: newAccount.firstName,
        lastName: newAccount.lastName,
        industries: newAccount.industries,
        timezone: newAccount.timezone,
        imageUrl: newAccount.imageUrl
      });
      Logger.info(`Created new profile - profileId: ${newAccount.profileId}`);
    } else {
      newAccount.profileId = Profiles.findOne(query)._id;
      haveData = 0;
      checkExists.profile = true;
      Logger.warn(`Profile exists - profileId: ${newAccount.profileId}`);
    }
    if (!checkExists.profile) {
      // Send migration information email to user
      const tokenId = Tokens.insert({email: newAccount.email, action: 'migration'});
      if (!_.isEmpty(tokenId)) {
        // call methods to send verify Email with token link to user
        // route to Welcome page with a message to verify user's email
        const
          verifyUrl = `/signup/migration?token=${tokenId}`,
          url = `http://${DOMAIN}${verifyUrl}`,
          template = 'migration',
          data = {
            email: newAccount.email,
            firstName: newAccount.firstName,
            url: url
          };
        Logger.info(`create new user success with userId: ${newAccount.userId}`);
        if(Meteor.settings.public.env === "production") {
          EmailActions.send.call({template, data});
        } else {
          Logger.info(`send email: ${template} to ${data.email}`);
        }
      }
    } else {
      Logger.info(`create profile failed for ${newAccount.userId}`);
    }
  } else {
    Logger.warn(`No new user created for old user ${oldUserId}`);
  }

  // get new organization info
  if (!_.isEmpty(newAccount.userId)) {
    newOrg.leaderId = newAccount.userId;
    query = {leaderId: newAccount.userId, name: newOrg.name};
    haveData = Organizations.find(query).count();
    if (haveData === 0) {
      newOrg.organizationId = Organizations.insert({
        leaderId: newAccount.userId,
        name: newOrg.name,
        imageUrl: newOrg.imageUrl,
        startTime: user.createdAt,
        endTime: new Date()
      });
      Logger.info(`Created new organization - organizationId: ${newOrg.organizationId}`);
    } else {
      newOrg.organizationId = Organizations.findOne(query)._id;
      haveData = 0;
      checkExists.org = true;
      Logger.warn(`Organization exists - organizationId: ${newOrg.organizationId}`);
    }

    if (!checkExists.org) {
      // get list of employees
      employees.map(employee => {
        const
          oldEmployeeId = employee.elseId,
          employeeProfile = MProfiles.findOne({userId: oldEmployeeId})
          ;

        newEmployee.leaderId = newAccount.userId;
        newEmployee.organizationId = newOrg.organizationId;
        newEmployee.firstName = employeeProfile.firstName;
        newEmployee.lastName = employeeProfile.lastName;
        newEmployee.email = MUsers.findOne({_id: oldEmployeeId}).emails[0].address;

        query = {
          email: newEmployee.email,
          leaderId: newEmployee.leaderId,
          organizationId: newEmployee.organizationId
        };
        haveData = Employees.find(query).count();
        if (haveData === 0) {
          newEmployee.employeeId = Employees.insert({
            leaderId: newEmployee.leaderId,
            organizationId: newEmployee.organizationId,
            firstName: newEmployee.firstName,
            lastName: newEmployee.lastName,
            email: newEmployee.email
          });
          newEmployee.noOfEmployees++;
          Logger.info(`Created new employee - employeeId: ${newEmployee.employeeId}`);
        } else {
          newEmployee.employeeId = Employees.findOne(query)._id;
          haveData = 0;
          Logger.warn(`Employee exists - employeeId: ${newEmployee.employeeId}`);
        }
      });
    } else {
      Logger.warn(`no new org created for the old user ${oldUserId} with new user ${newAccount.userId}`)
    }
  } else {
    Logger.warn(`no new organization created for the old user ${oldUserId}, can not create organization`)
  }

  if (!checkExists.org) {
    // import metrics
    surveys.map(survey => {
      oldEmployee = MUsers.findOne({_id: survey.createdBy});
      if (!_.isEmpty(oldEmployee)) {
        oldEmployeeEmail = oldEmployee.emails[0].address;
        // get newEmployeeId
        employee = Employees.findOne({email: oldEmployeeEmail});
        if (!_.isEmpty(employee)) {
          newEmployeeId = employee._id;

          // add metrics for user
          for (var i in survey) {
            var
              metric = "",
              score = 0
              ;
            if (typeof metricsName[i] !== 'undefined') {
              metric = metricsName[i];
              score = survey[i];

              newMetric.leaderId = newAccount.userId;
              newMetric.organizationId = newOrg.organizationId;
              newMetric.employeeId = newEmployeeId;
              newMetric.metric = metric;
              newMetric.score = score;
              newMetric.date = survey.createdAt;

              // create metric for user
              query = {
                planId: newMetric.planId,
                leaderId: newMetric.leaderId,
                organizationId: newMetric.organizationId,
                employeeId: newMetric.employeeId,
                metric: newMetric.metric,
              };
              haveData = Metrics.find(query).count();
              if (haveData === 0) {
                newMetric.metricId = Metrics.insert({
                  planId: newMetric.planId,
                  leaderId: newMetric.leaderId,
                  organizationId: newMetric.organizationId,
                  employeeId: newMetric.employeeId,
                  metric: newMetric.metric,
                  score: newMetric.score,
                  date: newMetric.date
                });
                newMetric.noOfMetrics++;
                Logger.info(`Created new metric - metric: ${metric}, score: ${score} with metricId: ${newMetric.metricId}`);
              } else {
                haveData = 0;
                Logger.warn(`Metric exists - metric: ${metric}, score: ${score}`);
              }
            }
          }
        }
      }
    });

    // import feedbacks
    feedbacks.map(feedback => {
      oldEmployee = MUsers.findOne({_id: feedback.createdBy});
      if (!_.isEmpty(oldEmployee)) {
        oldEmployeeEmail = oldEmployee.emails[0].address;
        // get newEmployeeId
        employee = Employees.findOne({email: oldEmployeeEmail});
        if (!_.isEmpty(employee)) {
          newEmployeeId = employee._id;

          // get feedback info
          newFeedback.leaderId = newAccount.userId;
          newFeedback.organizationId = newOrg.organizationId;
          newFeedback.employeeId = newEmployeeId;
          newFeedback.feedback = feedback.content;
          newFeedback.date = feedback.createdAt;


          // create feedback for user
          query = {
            planId: newFeedback.planId,
            leaderId: newFeedback.leaderId,
            organizationId: newFeedback.organizationId,
            employeeId: newFeedback.employeeId,
            metric: newFeedback.metric,
          };
          haveData = Feedbacks.find(query).count();
          if (haveData === 0) {
            newFeedback.feedbackId = Feedbacks.insert({
              planId: newFeedback.planId,
              leaderId: newFeedback.leaderId,
              organizationId: newFeedback.organizationId,
              employeeId: newFeedback.employeeId,
              metric: newFeedback.metric,
              feedback: newFeedback.feedback,
              date: newFeedback.date
            });
            newFeedback.noOfFeedback++;
            Logger.info(`Created new feedback ${newFeedback.feedbackId}`);

          } else {
            haveData = 0;
            Logger.warn(`Feedback exists: ${newFeedback.feedback}`);
          }
        }
      }

    });

    // measure migration data
    measureDate = new Date(2015, 7, 1);
    measureMonthlyMetricScore.call({params: {leaderId: newAccount.userId, date: measureDate}}, (error, result) => {
      if (!error) {
        Logger.info(`Measure metrics data for ${newAccount.userId} in ${measureDate} - success`);
      } else {
        Logger.warn(`Measure metrics data for ${newAccount.userId} in ${measureDate} - failed: ${error.reason}`);
      }
    });
    measureDate = new Date(2015, 8, 1);
    measureMonthlyMetricScore.call({params: {leaderId: newAccount.userId, date: measureDate}}, (error, result) => {
      if (!error) {
        Logger.info(`Measure metrics data for ${newAccount.userId} in ${measureDate} - success`);
      } else {
        Logger.warn(`Measure metrics data for ${newAccount.userId} in ${measureDate} - failed: ${error.reason}`);
      }
    });
    measureDate = new Date(2015, 9, 1);
    measureMonthlyMetricScore.call({params: {leaderId: newAccount.userId, date: measureDate}}, (error, result) => {
      if (!error) {
        Logger.info(`Measure metrics data for ${newAccount.userId} in ${measureDate} - success`);
      } else {
        Logger.warn(`Measure metrics data for ${newAccount.userId} in ${measureDate} - failed: ${error.reason}`);
      }
    });
    measureDate = new Date(2015, 10, 1);
    measureMonthlyMetricScore.call({params: {leaderId: newAccount.userId, date: measureDate}}, (error, result) => {
      if (!error) {
        Logger.info(`Measure metrics data for ${newAccount.userId} in ${measureDate} - success`);
      } else {
        Logger.warn(`Measure metrics data for ${newAccount.userId} in ${measureDate} - failed: ${error.reason}`);
      }
    });
    measureDate = new Date(2015, 11, 1);
    measureMonthlyMetricScore.call({params: {leaderId: newAccount.userId, date: measureDate}}, (error, result) => {
      if (!error) {
        Logger.info(`Measure metrics data for ${newAccount.userId} in ${measureDate} - success`);
      } else {
        Logger.warn(`Measure metrics data for ${newAccount.userId} in ${measureDate} - failed: ${error.reason}`);
      }
    });
    measureDate = new Date(2016, 0, 1);
    measureMonthlyMetricScore.call({params: {leaderId: newAccount.userId, date: measureDate}}, (error, result) => {
      if (!error) {
        Logger.info(`Measure metrics data for ${newAccount.userId} in ${measureDate} - success`);
      } else {
        Logger.warn(`Measure metrics data for ${newAccount.userId} in ${measureDate} - failed: ${error.reason}`);
      }
    });
    measureDate = new Date(2016, 1, 1);
    measureMonthlyMetricScore.call({params: {leaderId: newAccount.userId, date: measureDate}}, (error, result) => {
      if (!error) {
        Logger.info(`Measure metrics data for ${newAccount.userId} in ${measureDate} - success`);
      } else {
        Logger.warn(`Measure metrics data for ${newAccount.userId} in ${measureDate} - failed: ${error.reason}`);
      }
    });
    measureDate = new Date(2016, 2, 1);
    measureMonthlyMetricScore.call({params: {leaderId: newAccount.userId, date: measureDate}}, (error, result) => {
      if (!error) {
        Logger.info(`Measure metrics data for ${newAccount.userId} in ${measureDate} - success`);
      } else {
        Logger.warn(`Measure metrics data for ${newAccount.userId} in ${measureDate} - failed: ${error.reason}`);
      }
    });
    measureDate = new Date(2016, 3, 1);
    measureMonthlyMetricScore.call({params: {leaderId: newAccount.userId, date: measureDate}}, (error, result) => {
      if (!error) {
        Logger.info(`Measure metrics data for ${newAccount.userId} in ${measureDate} - success`);
      } else {
        Logger.warn(`Measure metrics data for ${newAccount.userId} in ${measureDate} - failed: ${error.reason}`);
      }
    });

    report.oldUserId = oldUserId;
    report.newUserId = newAccount.userId;
    report.organizationId = newOrg.organizationId;
    report.noOfEmployees = newEmployee.noOfEmployees;
    report.noOfMetrics = newMetric.noOfMetrics;
    report.noOfFeedback = newFeedback.noOfFeedback;
    Logger.info(report);
  }
}