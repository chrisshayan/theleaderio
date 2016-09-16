import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {FlowRouter} from 'meteor/kadira:flow-router';

// collections
import {
  MUsers,
  MProfiles,
  MRelationships,
  MSurveys,
  MFeedbacks
} from './collections';
import {Profiles, STATUS_ACTIVE, STATUS_INACTIVE} from '/imports/api/profiles/index';
import {Organizations} from '/imports/api/organizations/index';
import {Employees} from '/imports/api/employees/index';
import {Metrics} from '/imports/api/metrics/index';
import {Feedbacks} from'/imports/api/feedbacks/index';

// methods
import * as TokenActions from '/imports/api/tokens/methods';
import * as EmailActions from '/imports/api/email/methods';

// constants
import {DEFAULT_PROFILE_PHOTO, DEFAULT_ORGANIZATION_PHOTO} from '/imports/utils/defaults';

/**
 * Function collect migration data for a user
 * @param params
 */
export const migrateUserData = ({params}) => {
  if (typeof params.oldUserId === 'undefined') {
    return;
  }
  const
    DOMAIN = Meteor.settings.public.domain,
    {oldUserId} = params,
    newAccount = {
      userId: "",
      profileId: "",
      alias: "",
      email: "",
      password: "migration160916",
      firstName: "",
      lastName: "",
      timezone: Meteor.settings.public.localTimezone,
      industries: [],
      imageUrl: DEFAULT_PROFILE_PHOTO
    },
    newOrg = {
      organizationId: "",
      name: "default",
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
      leaderId: ""
    },
    newMetric = {
      metricId: "",
      planId: "migration",
      leaderId: "",
      organizationId: "",
      employeeId: "",
      metric: "",
      score: 0,
      date: new Date()
    },
    newFeedback = {
      feedbackId: "",
      planId: "migration",
      leaderId: "",
      organizationId: "",
      employeeId: "",
      metric: "leadership",
      feedback: "",
      date: new Date()
    },
    metricsName = {
      goalRating: "purpose",
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
    feedbacks = MFeedbacks.find({leaderId: oldUserId}).fetch()
    ;
  let
    oldEmployeeEmail = "",
    oldEmployeeId = "",
    newEmployeeId = "",
    haveData = 0,
    query = {}
    ;

  // get new account info
  newAccount.email = user.emails[0].address;
  newAccount.firstName = profile.firstName;
  newAccount.lastName = profile.lastName;
  newAccount.industries = profile.industries;

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
    console.log(`Created new account - userId: ${newAccount.userId}`);
  } else {
    newAccount.userId = Accounts.users.findOne(query)._id;
    haveData = 0;
    console.log(`Account exists - userId: ${newAccount.userId}`);
  }
  if (!_.isEmpty(newAccount.userId)) {
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
      console.log(`Created new profile - profileId: ${newAccount.profileId}`);
    } else {
      newAccount.profileId = Profiles.findOne(query)._id;
      haveData = 0;
      console.log(`Profile exists - profileId: ${newAccount.profileId}`);
    }
    if (!_.isEmpty(newAccount.profileId)) {
      // Send migration information email to user
      const tokenId = TokenActions.generate.call({email: newAccount.email, action: 'migration'}, (error) => {
        if (!error) {
          // call methods to send verify Email with token link to user
          // route to Welcome page with a message to verify user's email
          const
            verifyUrl = FlowRouter.path('migrationPage', {action: 'migration'}, {token: tokenId}),
            url = `http://${DOMAIN}${verifyUrl}`,
            template = 'migration',
            data = {
              email: newAccount.email,
              firstName: newAccount.firstName,
              url: url
            };
          console.log(`create new user success with userId: ${newAccount.userId}`);
          console.log({template, data});
          // EmailActions.send.call({template, data});
        }
      });
    } else {
      Accounts.users.remove({_id: newAccount.userId});
      newAccount.userId = "";
      console.log(`create profile failed for ${newAccount.userId}`);
    }
  } else {
    console.log(`create user failed for old user ${oldUserId}`);
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
        imageUrl: newOrg.imageUrl
      });
      console.log(`Created new organization - organizationId: ${newOrg.organizationId}`);
    } else {
      newOrg.organizationId = Organizations.findOne(query)._id;
      haveData = 0;
      console.log(`Organization exists - organizationId: ${newOrg.organizationId}`);
    }

    if (!_.isEmpty(newOrg.organizationId)) {
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
          console.log(`Created new employee - employeeId: ${newEmployee.employeeId}`);
        } else {
          newEmployee.employeeId = Employees.findOne(query)._id;
          haveData = 0;
          console.log(`Employee exists - employeeId: ${newEmployee.employeeId}`);
        }
      });
    } else {
      Accounts.users.remove({_id: newAccount.userId});
      newAccount.userId = "";
      Profiles.remove({userId: newAccount.userId});
      newAccount.profileId = "";
      console.log(`no new org created for the old user ${oldUserId} with new user ${newAccount.userId}`)
    }
  } else {
    console.log(`no new organization created for the old user ${oldUserId}, can not create organization`)
  }

  // get user metrics
  surveys.map(survey => {
    oldEmployeeEmail = MUsers.findOne({_id: survey.createdBy}).emails[0].address;
    // get newEmployeeId
    newEmployeeId = Employees.findOne({email: oldEmployeeEmail})._id;

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
          Metrics.insert({
            planId: newMetric.planId,
            leaderId: newMetric.leaderId,
            organizationId: newMetric.organizationId,
            employeeId: newMetric.employeeId,
            metric: newMetric.metric,
            score: newMetric.score,
            date: newMetric.date
          });
          console.log(`Created new metric - metric: ${metric}, score: ${score}`);
        } else {
          haveData = 0;
          console.log(`Metric exists - metric: ${metric}, score: ${score}`);
        }
      }
    }
  });

  feedbacks.map(feedback => {
    oldEmployeeEmail = MUsers.findOne({_id: feedback.createdBy}).emails[0].address;
    // get newEmployeeId
    newEmployeeId = Employees.findOne({email: oldEmployeeEmail})._id;

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
      console.log({
        planId: newFeedback.planId,
        leaderId: newFeedback.leaderId,
        organizationId: newFeedback.organizationId,
        employeeId: newFeedback.employeeId,
        metric: newFeedback.metric,
        feedback: newFeedback.feedback,
        date: newFeedback.date
      });
      Feedbacks.insert({
        planId: newFeedback.planId,
        leaderId: newFeedback.leaderId,
        organizationId: newFeedback.organizationId,
        employeeId: newFeedback.employeeId,
        metric: newFeedback.metric,
        feedback: newFeedback.feedback,
        date: newFeedback.date
      });
      console.log(`Created new feedback`);

    } else {
      haveData = 0;
      console.log(`Feedback exists`);
    }
  });

}