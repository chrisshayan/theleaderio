import {Meteor} from 'meteor/meteor';
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
import {measure, getMetricStatistic, STATISTIC_METRICS} from './functions';

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
    if (countChartData === 0) {
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
    if (haveLeaderId) {
      selector.leaderId = params.leaderId;
    }
    if (haveOrgId) {
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
        if (!haveLeaderId) {
          leaderList.push(doc.leaderId);
        }
      });

      if (haveLeaderId) {
        leaderList.push(params.leaderId);
      } else {
        leaderList = _.uniq(leaderList); // get unique leader only
      }

      // get average score for every leader
      leaderList.map(leaderId => {
        //get list of organization for specific leader
        if (haveOrgId) {
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
              if (score > 3) {
                noOfGoodScores++;
              } else {
                noOfBadScores++;
              }
              scoreList.push(score);
            });

            noOfScores = scoreList.length;
            if (noOfScores > 0) {
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
 * @param {String} type
 * @param {String} interval - LAST_WEEK, LAST_2_WEEKS, LAST_MONTH, LAST_3_MONTHS
 *
 */
export const measureAdminStatistic = new ValidatedMethod({
  name: "measures.adminStatistic",
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: ERROR_CODE.UNAUTHENTICATED,
    message: 'You need to be logged in to call this method',//Optional
    reason: 'You need to login' //Optional
  },
  validate: new SimpleSchema({
    params: {
      type: Object
    },
    "params.type": {
      type: String,
      allowedValues: ["NEW_CREATION", "EMAIL_SENT"]
    },
    "params.interval": {
      type: String,
      allowedValues: ["LAST_WEEK", "LAST_2_WEEKS", "LAST_MONTH", "LAST_3_MONTHS"]
    }
  }).validator(),
  run({params}) {
    const
      {type, interval} = params,
      endDate = new Date(),
      today = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()),
      userId = Meteor.userId(),
      STATISTIC_TYPES = {
        NEW_CREATION: [
          STATISTIC_METRICS.USERS,
          STATISTIC_METRICS.ORGANIZATIONS,
          STATISTIC_METRICS.EMPLOYEES
        ],
        EMAIL_SENT: [
          STATISTIC_METRICS.EMAILS.SURVEYS,
          STATISTIC_METRICS.EMAILS.SCORING_SUCCESSES,
          STATISTIC_METRICS.EMAILS.SCORING_ERRORS,
          STATISTIC_METRICS.EMAILS.FEEDBACK_TO_LEADERS,
          STATISTIC_METRICS.EMAILS.FEEDBACK_TO_EMPLOYEES,
          STATISTIC_METRICS.EMAILS.WEEKLY_DIGEST,
          STATISTIC_METRICS.EMAILS.REFERRALS,
          STATISTIC_METRICS.EMAILS.REGISTRATION,
          STATISTIC_METRICS.EMAILS.FORGOT_ALIAS,
          STATISTIC_METRICS.EMAILS.FORGOT_PASSWORD
        ]
      },
      STATISTIC_INTERVAL = {
        LAST_WEEK: {
          interval: {days: 7},
          offset: {days: 1}
        },
        LAST_2_WEEKS: {
          interval: {days: 14},
          offset: {days: 2}
        },
        LAST_MONTH: {
          interval: {months: 1},
          offset: {days: 7}
        },
        LAST_3_MONTHS: {
          interval: {months: 3},
          offset: {days: 14}
        }
      };
    let
      startDate = new Date(),
      result = {
        ready: false,
        labels: [],
        data: []
      }
      ;

    if(!this.isSimulation) {
      if(!Roles.userIsInRole(userId, "admin")) {
        throw new Meteor.Error(ERROR_CODE.PERMISSION_DENIED, `user: ${userId} isn't an admin.`);
      }
    }

    startDate = new Date(moment(today).subtract(STATISTIC_INTERVAL[interval].interval));

    STATISTIC_TYPES[type].map(type => {
      const data = getMetricStatistic({
        params: {
          metric: type,
          startDate,
          endDate,
          offset: STATISTIC_INTERVAL[interval].offset
        }
      });
      result.labels = data.labels;
      result.data.push(data.data);
    });
    result.ready = true;
    return result;
  }
});
