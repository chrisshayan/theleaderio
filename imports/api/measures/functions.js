import moment from 'moment';
import _ from 'lodash';

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

// constants
import * as ERROR_CODE from '/imports/utils/error_code';
export const STATISTIC_METRICS = {
  USERS: "users",
  ORGANIZATIONS: "organizations",
  EMPLOYEES: "employees",
  EMAILS: {
    REGISTRATION: "emailRegistration",
    FORGOT_ALIAS: "emailForgotAlias",
    FORGOT_PASSWORD: "emailForgotPassword",
    SURVEYS: "emailSurveys",
    SCORING_ERRORS: "emailScoringErrors",
    SCORING_SUCCESSES: "emailScoringSuccesses",
    FEEDBACK_TO_LEADERS: "emailFeedbackToLeaders",
    FEEDBACK_TO_EMPLOYEES: "emailFeedbackToEmployees",
    WEEKLY_DIGEST: "emailWeeklyDigest",
    REFERRALS: "emailReferrals"
  },
};
export const STATISTIC_INTERVAL = {
  LAST_WEEK: {days: 7},
  LAST_2_WEEKS: {days: 14},
  LAST_MONTH: {months: 1},
  LAST_3_MONTHS: {months: 3}
};

/**
 * @summary this function used to insert/update the measure data which collect data for measurement
 * @param {Object} data include leaderId, organizationId, type, interval, year, month, day, key, value
 * @return {Number} the result of updating data into Measures Collection
 */
export const measure = ({data}) => {
  const {leaderId, organizationId, type, interval, year, month, day, key, value} = data;
  let
    query = {},
    update = {},
    options = {}
    ;

  switch (type) {
    case "metric":
    {
      query = {leaderId, organizationId, type, interval, year, month, key};
      update = {$set: {value}};
      options = {upsert: true};
      break;
    }
    case "feedback":
    {

      break;
    }
    case "statistic":
    {
      query = {type, interval, year, month, day, key};
      update = {$set: {value}};
      options = {upsert: true};
      break;
    }
    default:
    {
      return `unknown type: ${type}`;
    }
  }

  return Measures.update(query, update, options);
};

/**
 * @summary collect measure data of a month for metric
 * @description collect all score in current month,
 * @description get average score for every metric in every organization of every leader
 * @return true if success, false if failed
 */
export const measureMonthlyMetricScore = () => {
  // create mini mongo collection
  const MiniMongo = new Mongo.Collection(null);
  MiniMongo.remove({});
  const
  // {} = job.data,
    runDate = new Date(),
    year = runDate.getFullYear(),
    month = runDate.getMonth(),
    nextMonth = month + 1
    ;
  let
    jobMessage = "",
    selector = {},
    modifier = {},
    leaderList = [],
    result = false
    ;

  // Get list of leaders
  selector = {
    date: {
      $gte: new Date(year, month, 1),
      $lt: new Date(year, nextMonth, 1)
    }
  }; // only get data in current month
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

    docs.map(doc => {
      MiniMongo.insert(doc);
      leaderList.push(doc.leaderId);
    });
    leaderList = _.uniq(leaderList); // get unique leader only

    // get average score for every leader
    leaderList.map(leaderId => {
      const leaderDocs = MiniMongo.find({leaderId}).fetch();
      let orgList = [];

      //get list of organization for specific leader
      leaderDocs.map(leaderDoc => {
        orgList.push(leaderDoc.organizationId);
        orgList = _.uniq(orgList);
      });
      // get list of metric for specific organization
      orgList.map(organizationId => {
        let
          metricList = [],
          orgDocs = MiniMongo.find({leaderId, organizationId}).fetch()
          ;
        orgDocs.map(orgDoc => {
          metricList.push(orgDoc.metric);
          metricList = _.uniq(metricList);
        });
        // get list of score for specific metric
        metricList.map(metric => {
          const metricDocs = MiniMongo.find({leaderId, organizationId, metric}).fetch();
          let
            scoreList = [],
            averageScore = 0,
            noOfScores = 0,
            noOfGoodScores = 0, // count the number of score from 4 to 5
            noOfBadScores = 0, // count the number of score from 1 to 3
            measureDoc = {} // data of measure for leader
            ;

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
        });
      });
    });
    return true;
  } else {
    return false;
  }
}

/**
 * Function get statistic of 1 metric with the inteval
 * @param {String} metric - 1 metric in STATISTIC_METRICS object
 * @param {String} interval - 1 interval in STATISTIC_INTERVAL object
 * @return {{ready: boolean, labels: Array, data: Array}}
 */
export const getMetricStatistic = ({params}) => {
  const
    {metric, startDate, endDate, offset} = params,
    MiniMongo = new Mongo.Collection(null)
    ;
  let
    query = {},
    options = {},
    data = [],
    result = {
      labels: [],
      data: []
    }
    ;

  switch (metric) {
    // new creation
    case STATISTIC_METRICS.USERS: {
      query = {createdAt: {$gte: startDate}};
      options = {fields: {createdAt: true}};
      data = Accounts.users.find(query, options).fetch();

      if (!_.isEmpty(data)) {
        data.map(user => {
          MiniMongo.insert({type: metric, data: {userId: user._id, createdAt: user.createdAt}});
        });
      }
      break;
    }
    case STATISTIC_METRICS.ORGANIZATIONS: {
      query = {createdAt: {$gte: startDate}};
      options = {fields: {createdAt: true}};
      data = Organizations.find(query, options).fetch();

      if (!_.isEmpty(data)) {
        data.map(organization => {
          MiniMongo.insert({type: metric, data: {orgId: organization._id, createdAt: organization.createdAt}});
        });
      }
      break;
    }
    case STATISTIC_METRICS.EMPLOYEES: {
      query = {createdAt: {$gte: startDate}};
      options = {fields: {createdAt: true}};
      data = Employees.find(query, options).fetch();

      if (!_.isEmpty(data)) {
        data.map(employee => {
          MiniMongo.insert({type: metric, data: {employeeId: employee._id, createdAt: employee.createdAt}});
        });
      }
      break;
    }
    // emails to employees
    case STATISTIC_METRICS.EMAILS.SURVEYS: {
      query = {"content.options.userVariables.template": "survey", date: {$gte: startDate}};
      options = {fields: {date: true}};
      data = LogsEmail.find(query, options).fetch();

      if (!_.isEmpty(data)) {
        data.map(email => {
          MiniMongo.insert({type: metric, data: {emailId: email._id, createdAt: email.date}});
        });
      }
      break;
    }
    case STATISTIC_METRICS.EMAILS.SCORING_SUCCESSES: {
      Collection = LogsEmail;
      query = {"content.options.userVariables.template": "thankyou", "content.data.type": "scoring", date: {$gte: startDate}};
      options = {fields: {date: true}};
      data = LogsEmail.find(query, options).fetch();

      if (!_.isEmpty(data)) {
        data.map(email => {
          MiniMongo.insert({type: metric, data: {emailId: email._id, createdAt: email.date}});
        });
      }
      break;
    }
    case STATISTIC_METRICS.EMAILS.SCORING_ERRORS: {
      Collection = LogsEmail;
      query = {"content.options.userVariables.template": "survey_error", date: {$gte: startDate}};
      options = {fields: {date: true}};
      data = LogsEmail.find(query, options).fetch();

      if (!_.isEmpty(data)) {
        data.map(email => {
          MiniMongo.insert({type: metric, data: {emailId: email._id, createdAt: email.date}});
        });
      }
      break;
    }
    case STATISTIC_METRICS.EMAILS.FEEDBACK_TO_LEADERS: {
      Collection = LogsEmail;
      query = {"content.options.userVariables.template": "feedback", date: {$gte: startDate}};
      options = {fields: {date: true}};
      data = LogsEmail.find(query, options).fetch();

      if (!_.isEmpty(data)) {
        data.map(email => {
          MiniMongo.insert({type: metric, data: {emailId: email._id, createdAt: email.date}});
        });
      }
      break;
    }
    // emails to leaders
    case STATISTIC_METRICS.EMAILS.FEEDBACK_TO_EMPLOYEES: {
      Collection = LogsEmail;
      query = {"content.options.userVariables.template": "employee", "content.data.type": "feedback", date: {$gte: startDate}};
      options = {fields: {date: true}};
      data = LogsEmail.find(query, options).fetch();

      if (!_.isEmpty(data)) {
        data.map(email => {
          MiniMongo.insert({type: metric, data: {emailId: email._id, createdAt: email.date}});
        });
      }
      break;
    }
    case STATISTIC_METRICS.EMAILS.WEEKLY_DIGEST: {
      Collection = LogsEmail;
      query = {"content.options.userVariables.template": "digest", date: {$gte: startDate}};
      options = {fields: {date: true}};
      data = LogsEmail.find(query, options).fetch();

      if (!_.isEmpty(data)) {
        data.map(email => {
          MiniMongo.insert({type: metric, data: {emailId: email._id, createdAt: email.date}});
        });
      }
      break;
    }
    // emails referral
    case STATISTIC_METRICS.EMAILS.REFERRALS: {
      Collection = LogsEmail;
      query = {"content.options.userVariables.template": "referral", date: {$gte: startDate}};
      options = {fields: {date: true}};
      data = LogsEmail.find(query, options).fetch();

      if (!_.isEmpty(data)) {
        data.map(email => {
          MiniMongo.insert({type: metric, data: {emailId: email._id, createdAt: email.date}});
        });
      }
      break;
    }
    // email registration
    case STATISTIC_METRICS.EMAILS.REGISTRATION: {
      Collection = LogsEmail;
      query = {"content.options.userVariables.template": "welcome", date: {$gte: startDate}};
      options = {fields: {date: true}};
      data = LogsEmail.find(query, options).fetch();

      if (!_.isEmpty(data)) {
        data.map(email => {
          MiniMongo.insert({type: metric, data: {emailId: email._id, createdAt: email.date}});
        });
      }
      break;
    }
    // emails support
    case STATISTIC_METRICS.EMAILS.FORGOT_ALIAS: {
      Collection = LogsEmail;
      query = {"content.options.userVariables.template": "forgot_alias", date: {$gte: startDate}};
      options = {fields: {date: true}};
      data = LogsEmail.find(query, options).fetch();

      if (!_.isEmpty(data)) {
        data.map(email => {
          MiniMongo.insert({type: metric, data: {emailId: email._id, createdAt: email.date}});
        });
      }
      break;
    }
    case STATISTIC_METRICS.EMAILS.FORGOT_PASSWORD: {
      Collection = LogsEmail;
      query = {"content.options.userVariables.template": "forgot_password", date: {$gte: startDate}};
      options = {fields: {date: true}};
      data = LogsEmail.find(query, options).fetch();

      if (!_.isEmpty(data)) {
        data.map(email => {
          MiniMongo.insert({type: metric, data: {emailId: email._id, createdAt: email.date}});
        });
      }
      break;
    }
    default: {
      throw new Meteor.Error(ERROR_CODE.INVALID_PARAMETER, `Unknown metric: ${metric} to measure`);
    }
  }

  // Calculate statistic
  for (let day = startDate, end = endDate; day <= end; day = new Date(moment(day).add(offset))) {
    const
      label = moment(day).format('MMM Do'),
      query = {type: metric, "data.createdAt": {$gte: day, $lt: new Date(moment(day).add(offset))}}
      ;

    // result labels & data
    result.labels.push(label);
    result.data.push(MiniMongo.find(query).count());
  }

  // console.log(result);
  return result;
}