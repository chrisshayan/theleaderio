import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {Metrics} from './index';

// constants
import {DEFAULT_METRICS} from '/imports/utils/defaults';

// functions
import {arraySum} from '/imports/utils/index';

export const add = new ValidatedMethod({
  name: "metrics.add",
  validate: null,
  run({metric, score, planId, leaderId, organizationId, employeeId, date, data}) {
    const doc = {
      planId,
      leaderId,
      organizationId,
      date
    };
    if(typeof employeeId !== 'undefined') {
      doc.employeeId = employeeId;
    }
    if(typeof metric !== 'undefined') {
      doc.metric = metric;
    }
    if(typeof score !== 'undefined') {
      doc.score = score;
    }
    if(typeof data !== 'undefined') {
      doc.data = data;
    }
    Metrics.insert(doc);
  }
});

export const checkExists = new ValidatedMethod({
  name: "metrics.checkExists",
  validate: null,
  run({planId, organizationId}) {
    const metric = Metrics.findOne({planId, organizationId});
    if(!_.isEmpty(metric)) {
      return metric.date;
    } else {
      return false;
    }
  }
});

/**
 * @summary Get metrics score of month
 * @params leaderId, month, year
 * @return {metrics, month, year}
 */
export const getMetricsOfMonth = new ValidatedMethod({
  name: "metrics.getMetrics",
  validate: null,
  run({leaderId, month, year}) {
    // const year = date.getFullYear();
    // const month = date.getMonth();
    // const day = date.getDate();
    const nextMonth = month + 1;
    const selector = {leaderId, date: {$gte: new Date(year, month, 1), $lt: new Date(year, nextMonth, 1)}};
    const modifier = {};

    const metrics = Metrics.find(selector).fetch();
    let result = {};
    let metricsScores = {};
    if(!_.isEmpty(metrics)) {
      // initiate result
      for(var i in DEFAULT_METRICS) {
        metricsScores[DEFAULT_METRICS[i]] = [];
      }
      // get result
      metrics.map(metric => {
        metricsScores[metric.name].push(metric.score);
      });
      for(var i in DEFAULT_METRICS) {
        var metric = DEFAULT_METRICS[i];
        if(!_.isEmpty(metricsScores[metric])) {
          const averageScore = arraySum(metricsScores[metric]) / metricsScores[metric].length;
          result[metric] = Number(averageScore.toFixed(1));
        }
      }
    } else {
      return [];
    }
    return result;
  }
});
