import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {Metrics} from './index';

export const create = new ValidatedMethod({
  name: "metrics.create",
  validate: null,
  run({name, score, planId, leaderId, organizationId, employeeId, date, data}) {
    console.log({name, score, planId, leaderId, organizationId, employeeId, date, data});
  }
});
