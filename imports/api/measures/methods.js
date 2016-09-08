import {ValidatedMethod} from 'meteor/mdg:validated-method';
import _ from 'lodash';

// collections
import {Measures} from './index';

// functions
import {arraySum} from '/imports/utils/index';


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
      // these data used for testing
      // result.label = ["April", "May", "June", "July", "August", "September"];
      // result.overall = [3.2, 4.0, 3.9, 4.9, 4.5, 4];
      // result.purpose = [2.2, 3.0, 4.9, 3.9, 5, 3];
      // result.mettings = [3.2, 3.0, 3.9, 4.9, 4, 4.3];
      // result.rules = [2.7, 4.6, 3.9, 3.2, 4, 3];
      // result.communications = [4.2, 2.0, 3.9, 4.9, 4, 4];
      // result.leadership = [3.2, 4.0, 3.9, 4.9, 4, 4];
      // result.workload = [3.2, 2.0, 3.9, 4.9, 2.3, 3];
      // result.energy = [2.7, 3.3, 4.6, 3.7, 4.5, 3.6];
      // result.stress = [3.3, 3.5, 4.2, 4.9, 5, 4];
      // result.decision = [2.6, 3.8, 4.2, 3.4, 3.4, 3.7];
      // result.respect = [4.2, 5.0, 3.9, 2.9, 4.5, 4];
      // result.conflict = [2.8, 2.0, 4.9, 4.9, 4.7, 4.4];
    } else {
      // reorder the values
      for (var e in result) {
        result[e] = _.reverse(result[e]);
      }
    }
    return result;
  }
});