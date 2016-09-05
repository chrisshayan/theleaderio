import moment from 'moment';
import _ from 'lodash';

// collections
import {Measures} from './index';
import {Metrics} from '/imports/api/metrics/index';

// functions
import {arraySum} from '/imports/utils/index';

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
            measureDoc = {} // data of measure for leader
            ;

          metricDocs.map(metricDoc => {
            scoreList.push(metricDoc.score);
          });

          measureDoc = {
            leaderId,
            organizationId,
            type: "metric",
            interval: "monthly",
            year,
            month,
            key: metric,
            value: {
              averageScore: scoreList.length,
              noOfScores: Number((arraySum(scoreList) / scoreList.length).toFixed(1))
            }
          };
          console.log(measureDoc)
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
 * @summary get data for chart
 * @description collect the last 6 months chart data
 * @param {String} leaderId
 * @param {String} organizationId
 * @param {Date} date the date which is the last month of data
 * @param {Number} noOfMonths the number of months which data will be returned
 * @return {Object} data the chart data for 11 metrics and overall of them
 */
export const getChartData = function ({leaderId, organizationId, date, noOfMonths}) {
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
    result = {}
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
      fields = {} // fields will receive from database
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
        score = Number(measure.value)
        ;
      noOfMetrics++;
      totalScore += score;
      metrics[metric] = score;
    });
    metrics.overall = totalScore === 0 ? totalScore : totalScore / noOfMetrics;

    // add metrics value into result
    for (var metric in metrics) {
      result[metric].push(metrics[metric]);
    }
  }
  // reorder the values
  for (var e in result) {
    result[e] = _.reverse(result[e]);
  }

  return result;
}