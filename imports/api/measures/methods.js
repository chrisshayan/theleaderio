import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {LoggedInMixin} from 'meteor/tunifight:loggedin-mixin';
import {Roles} from 'meteor/alanning:roles';
import _ from 'lodash';
import moment from 'moment';

// collections
import {Measures} from './index';
import {Metrics} from '/imports/api/metrics/index';
import {MiniMongo} from '/imports/api/cache/index';
import {Accounts} from 'meteor/accounts-base';
import {Organizations} from '/imports/api/organizations/index';
import {Employees} from '/imports/api/employees/index';
import {LogsEmail} from '/imports/api/logs/index';

// functions
import {arraySum} from '/imports/utils/index';
import {measure} from './functions';

// constants
import * as ERROR_CODE from '/imports/utils/error_code';

/**
 * @summary get data for chart
 * @description collect the last 6 months chart data
 * @param {String} leaderId
 * @param {String} organizationId
 * @param {Date} date the date which is the last month of data
 * @param {Number} noOfMonths the number of months which data will be returned
 * @return {Object} data the chart data for 11 metrics and overall of them
 */
export const getChartData = new ValidatedMethod({
  name: "measure.getChartData",
  validate: null,
  run({leaderId, organizationId, date, noOfMonths}) {
    const
      months = [
        {
          month: date.getMonth(),
          name: moment(date).format('MMMM'),
          year: date.getFullYear()
        }
      ]
      ;
    let
      result = {},
      countChartData = 0 // used to check the final result of chart data
      ;

    // Chart Data
    result = {
      label: [],
      overall: [],
      purpose: [],
      mettings: [],
      rules: [],
      communications: [],
      leadership: [],
      workload: [],
      energy: [],
      stress: [],
      decision: [],
      respect: [],
      conflict: []
    };

    // chart data
    for (var i = 0; i < noOfMonths; i++) {
      const
        previousMonth = new Date(moment().subtract(i, 'month')),
        month = {
          month: previousMonth.getMonth(),
          name: moment(previousMonth).format('MMMM'),
          year: previousMonth.getFullYear()
        };
      let
        overall = [], // overall data of metrics
        totalScore = 0, // score for overall
        noOfMetrics = 0, // the number of metrics in 1 month
        metrics = {
          label: "",
          overall: 0,
          purpose: 0,
          mettings: 0,
          rules: 0,
          communications: 0,
          leadership: 0,
          workload: 0,
          energy: 0,
          stress: 0,
          decision: 0,
          respect: 0,
          conflict: 0
        }, // current score of metrics
        selector = {}, // conditions for query database
        fields = {}, // fields will receive from database
        MeasuresData = []
      ;

      // get labels
      metrics.label = month.name;

      // get data
      selector = {
        leaderId,
        organizationId,
        type: "metric",
        interval: "monthly",
        year: month.year,
        month: month.month
      };
      fields = {
        key: true,
        value: true
      };
      MeasuresData = Measures.find(selector, {fields}).fetch();
      totalScore = 0;
      noOfMetrics = 0;
      MeasuresData.map(measure => {
        const
          metric = measure.key,
          score = Number(measure.value.averageScore)
          ;
        noOfMetrics++;
        totalScore += score;
        metrics[metric] = score;
      });
      metrics.overall = (totalScore === 0) ? totalScore : totalScore / noOfMetrics;
      metrics.overall = metrics.overall.toFixed(1);

      // add metrics value into result
      for (var metric in metrics) {
        result[metric].push(metrics[metric]);
      }
    }
    // return empty if no chart data
    countChartData = arraySum(result.overall);
    if(countChartData === 0) {
      result = [];
    } else {
      // reorder the values
      for (var e in result) {
        result[e] = _.reverse(result[e]);
      }
    }
    return result;
  }
});

/**
 * @summary Method measure monthly metric score
 * @param {Object} params
 * @param {String} params.leaderId
 * @param {String} params.organizationId
 * @param {Date} params.date - the date which is the last month of data
 * @return {Number} the number of docs had been upsert
 */
export const measureMonthlyMetricScore = new ValidatedMethod({
  name: "measures.measureMonthlyMetricScore",
  validate: null,
  run({params}) {
    const
      MiniMongo = new Mongo.Collection(null),
      runDate = (!!params.date ? params.date : new Date()),
      year = runDate.getFullYear(),
      month = runDate.getMonth(),
      nextMonth = month === 11 ? 1 : month + 1,
      haveLeaderId = !!params.leaderId,
      haveOrgId = !!params.organizationId
      ;
    let
      jobMessage = "",
      selector = {},
      modifier = {},
      leaderList = [],
      leaderDocs = [],
      orgList = [],
      metricList = [],
      orgDocs = [],
      metricDocs = [],
      scoreList = [],
      averageScore = 0,
      noOfScores = 0,
      noOfGoodScores = 0, // count the number of score from 4 to 5
      noOfBadScores = 0, // count the number of score from 1 to 3
      measureDoc = {}, // data of measure for leader
      result = false
      ;

    // Get list of leaders
    if(haveLeaderId) {
      selector.leaderId = params.leaderId;
    }
    if(haveOrgId) {
      selector.organizationId = params.organizationId;
    }
    selector.date = {
        $gte: new Date(year, month, 1),
        $lt: new Date(year, nextMonth, 1)
      }
    ; // only get data in current month
    modifier = {
      fields: {
        _id: 0,
        leaderId: 1,
        organizationId: 1,
        metric: 1,
        score: 1
      }
    }; // only return necessary fields

    // get leaders data in current month
    const docs = Metrics.find(selector, modifier).fetch();
    if (!_.isEmpty(docs)) {
      MiniMongo.remove({});
      docs.map(doc => {
        MiniMongo.insert(doc);
        if(!haveLeaderId) {
          leaderList.push(doc.leaderId);
        }
      });

      if(haveLeaderId) {
        leaderList.push(params.leaderId);
      } else {
        leaderList = _.uniq(leaderList); // get unique leader only
      }

      // get average score for every leader
      leaderList.map(leaderId => {
        //get list of organization for specific leader
        if(haveOrgId) {
          orgList.push(params.organizationId);
        } else {
          leaderDocs = MiniMongo.find({leaderId}).fetch();
          leaderDocs.map(leaderDoc => {
            orgList.push(leaderDoc.organizationId);
          });
          orgList = _.uniq(orgList);
        }

        // get list of metric for specific organization
        orgList.map(organizationId => {
          orgDocs = MiniMongo.find({leaderId, organizationId}).fetch();
          orgDocs.map(orgDoc => {
            metricList.push(orgDoc.metric);
          });
          metricList = _.uniq(metricList);
          // get list of score for specific metric
          metricList.map(metric => {
            metricDocs = MiniMongo.find({leaderId, organizationId, metric}).fetch();
            metricDocs.map(metricDoc => {
              const {score} = metricDoc;
              if(score > 3) {
                noOfGoodScores++;
              } else {
                noOfBadScores++;
              }
              scoreList.push(score);
            });

            noOfScores = scoreList.length;
            if(noOfScores > 0) {
              averageScore = Number(arraySum(scoreList) / scoreList.length).toFixed(1);
            }

            measureDoc = {
              leaderId,
              organizationId,
              type: "metric",
              interval: "monthly",
              year,
              month,
              key: metric,
              value: {
                averageScore,
                noOfScores,
                noOfGoodScores,
                noOfBadScores
              }
            };
            measure({data: measureDoc});
            noOfGoodScores = 0;
            noOfBadScores = 0;
          });
        });
      });
      return {
        noOfLeader: leaderList.length,
        noOfOrg: orgList.length
      };
    } else {
      return {};
    }
  }
});

/**
 * Method measure admin statistic
 * @param {}
 */
export const measureAdminStatistic = new ValidatedMethod({
  name: "measures.adminStatistic",
  // mixins: [LoggedInMixin],
  // checkLoggedInError: {
  //   error: ERROR_CODE.UNAUTHENTICATED,
  //   message: 'You need to be logged in to call this method',//Optional
  //   reason: 'You need to login' //Optional
  // },
  validate: new SimpleSchema({
    params: {
      type: Object
    },
    "params.days": {
      type: Number
    }
  }).validator(),
  run({params}) {
    const
      {days} = params,
      MiniMongo = new Mongo.Collection(null),
      today = new Date(),
      endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      startDate = new Date(moment(endDate).subtract(days, 'days')),
      userId = Meteor.userId(),
      STATISTIC_TYPES = [
        "users",
        "organizations",
        "employees",
        "emailRegistration",
        "emailForgotAlias",
        "emailForgotPassword",
        "emailSurveys",
        "emailScoringErrors",
        "emailFeedbackToLeaders",
        "emailFeedbackToEmployees",
        "emailWeeklyDigest",
        "emailReferral",
      ],
      measureDoc = {
        type: "statistic",
        interval: "daily",
        year: 0,
        month: 0,
        day: 0,
        key: "",
        value: {}
      }
      ;
    let
      query = {},
      options = {},
      users = [],
      organizations = [],
      employees = [],
      emails = [],
      result = {
        ready: false,
        labels: [],
        users: [],
        organizations: [],
        employees: [],
        emailRegistration: [],
        emailForgotAlias: [],
        emailForgotPassword: [],
        emailSurveys: [],
        emailScoringErrors: [],
        emailFeedbackToLeaders: [],
        emailFeedbackToEmployees: [],
        emailWeeklyDigest: [],
        emailReferral: [],
      }
    ;

    // if(!Roles.userIsInRole(userId, "admin")) {
    //   throw new Meteor.Error(ERROR_CODE.PERMISSION_DENIED, `user: ${userId} isn't an admin.`);
    // }

    // Import data to cache
    // New Creation
    // users
    query = {createdAt: {$gte: startDate}};
    options = {fields: {createdAt: true}};
    users = Accounts.users.find(query, options).fetch();

    if(!_.isEmpty(users)) {
      users.map(user => {
        MiniMongo.insert({type: "users", data: {userId: user._id, createdAt: user.createdAt}});
      });
    }
    // organizations
    query = {createdAt: {$gte: startDate}};
    options = {fields: {createdAt: true}};
    organizations = Organizations.find(query, options).fetch();

    if(!_.isEmpty(organizations)) {
      organizations.map(organization => {
        MiniMongo.insert({type: "organizations", data: {orgId: organization._id, createdAt: organization.createdAt}});
      });
    }
    // employees
    query = {createdAt: {$gte: startDate}};
    options = {fields: {createdAt: true}};
    employees = Employees.find(query, options).fetch();

    if(!_.isEmpty(employees)) {
      employees.map(employee => {
        MiniMongo.insert({type: "employees", data: {employeeId: employee._id, createdAt: employee.createdAt}});
      });
    }

    // Emails
    // registration
    query = {"content.template": "welcome", date: {$gte: startDate}};
    options = {fields: {date: true}};
    emails = LogsEmail.find(query, options).fetch();

    if(!_.isEmpty(emails)) {
      emails.map(email => {
        MiniMongo.insert({type: "emailRegistration", data: {emailId: email._id, createdAt: email.date}});
      });
    }
    // user support
    query = {"content.template": "forgot_alias", date: {$gte: startDate}};
    options = {fields: {date: true}};
    emails = LogsEmail.find(query, options).fetch();

    if(!_.isEmpty(emails)) {
      emails.map(email => {
        MiniMongo.insert({type: "emailForgotAlias", data: {emailId: email._id, createdAt: email.date}});
      });
    }
    // user support
    query = {"content.template": "forgot_password", date: {$gte: startDate}};
    options = {fields: {date: true}};
    emails = LogsEmail.find(query, options).fetch();

    if(!_.isEmpty(emails)) {
      emails.map(email => {
        MiniMongo.insert({type: "emailForgotPassword", data: {emailId: email._id, createdAt: email.date}});
      });
    }
    // surveys
    query = {"content.template": "survey", date: {$gte: startDate}};
    options = {fields: {date: true}};
    emails = LogsEmail.find(query, options).fetch();

    if(!_.isEmpty(emails)) {
      emails.map(email => {
        MiniMongo.insert({type: "emailSurveys", data: {emailId: email._id, createdAt: email.date}});
      });
    }
    // scoring Errors
    query = {"content.template": "survey_error", date: {$gte: startDate}};
    options = {fields: {date: true}};
    emails = LogsEmail.find(query, options).fetch();

    if(!_.isEmpty(emails)) {
      emails.map(email => {
        MiniMongo.insert({type: "emailScoringErrors", data: {emailId: email._id, createdAt: email.date}});
      });
    }
    // feedback to Leaders
    query = {"content.template": "feedback", date: {$gte: startDate}};
    options = {fields: {date: true}};
    emails = LogsEmail.find(query, options).fetch();

    if(!_.isEmpty(emails)) {
      emails.map(email => {
        MiniMongo.insert({type: "emailFeedbackToLeaders", data: {emailId: email._id, createdAt: email.date}});
      });
    }
    // feedback to Leaders
    query = {"content.template": "employee", "content.data.type": "feedback", date: {$gte: startDate}};
    options = {fields: {date: true}};
    emails = LogsEmail.find(query, options).fetch();

    if(!_.isEmpty(emails)) {
      emails.map(email => {
        MiniMongo.insert({type: "emailFeedbackToEmployees", data: {emailId: email._id, createdAt: email.date}});
      });
    }
    // weekly digest
    query = {"content.template": "digest", date: {$gte: startDate}};
    options = {fields: {date: true}};
    emails = LogsEmail.find(query, options).fetch();

    if(!_.isEmpty(emails)) {
      emails.map(email => {
        MiniMongo.insert({type: "emailWeeklyDigest", data: {emailId: email._id, createdAt: email.date}});
      });
    }
    // Referrals
    query = {"content.template": "referral", date: {$gte: startDate}};
    options = {fields: {date: true}};
    emails = LogsEmail.find(query, options).fetch();

    if(!_.isEmpty(emails)) {
      emails.map(email => {
        MiniMongo.insert({type: "emailReferrals", data: {emailId: email._id, createdAt: email.date}});
      });
    }

    // Calculate statistic
    for(let day = startDate, end = endDate; day <= end; day = new Date(moment(day).add(1, 'day'))) {
      const
        label = moment(day).format('MMM Do'),
        query = {type: "", "data.createdAt": {$gte: day, $lt: new Date(moment(day).add(1, 'day'))}},
        statistic = MiniMongo.find().fetch();
      // const statistic = MiniMongo.find().fetch();
      // console.log(day);
      // console.log(statistic);
      // console.log('\n');

      // result labels
      result.labels.push(label);

      STATISTIC_TYPES.map(type => {
        query.type = type;
        result[type].push(MiniMongo.find(query).count());
      });
    }

    result.ready = true;
    return result;
    // console.log(result);
    // console.log(MiniMongo.find({type: "users"}).count());
    // console.log(MiniMongo.find({type: "organizations"}).count());
    // console.log(MiniMongo.find({type: "employees"}).count());
    // console.log(MiniMongo.find({type: "emailRegistration"}).count());
    // console.log(MiniMongo.find({type: "forgotAlias"}).count());
    // console.log(MiniMongo.find({type: "forgotPassword"}).count());
    // console.log(MiniMongo.find({type: "surveys"}).count());
    // console.log(MiniMongo.find({type: "scoringErrors"}).count());
    // console.log(MiniMongo.find({type: "feedbackToLeaders"}).count());
    // console.log(MiniMongo.find({type: "feedbackToEmployees"}).count());
    // console.log(MiniMongo.find({type: "weeklyDigest"}).count());
    // console.log(MiniMongo.find({type: "referrals"}).count());
  }
});
