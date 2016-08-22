import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {Metrics} from './index';

export const add = new ValidatedMethod({
  name: "metrics.add",
  validate: null,
  run({name, score, planId, leaderId, organizationId, employeeId, date, data}) {
    Metrics.insert({name, score, planId, leaderId, organizationId, employeeId, date, data});
  }
});
