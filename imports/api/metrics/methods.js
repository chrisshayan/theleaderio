import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {Metrics} from './index';

// constants
import {DEFAULT_METRICS} from '/imports/utils/defaults';

// functions
import {arraySum} from '/imports/utils/index';

export const add = new ValidatedMethod({
  name: "metrics.add",
  validate: null,
  run({metric, score, planId, leaderId, organizationId, employeeId, date}) {
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
    Metrics.insert(doc);
  }
});

export const checkExists = new ValidatedMethod({
  name: "metrics.checkExists",
  validate: null,
  run({planId, organizationId, employeeId}) {
    const metricData = Metrics.findOne({planId, organizationId, employeeId});
    if(!_.isEmpty(metricData)) {
      return metricData.date;
    } else {
      return false;
    }
  }
});