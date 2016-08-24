import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';

// collections
import {SendingPlans} from './index';

// constants
import * as ERROR_CODE from '/imports/utils/error_code';

export const create = new ValidatedMethod({
  name: "sendingPlans.create",
  validate: null,
  run({schedulerId, leaderId, metric, timezone, sendDate}) {
    return SendingPlans.insert({schedulerId, leaderId, metric, timezone, sendDate});
  }
});

export const edit = new ValidatedMethod({
  name: "sendingPlans.edit",
  validate: null,
  run(_id, metric, timezone, sendDate) {
    let selector = {_id},
        modifier = {}
      ;
    if(typeof metric !== 'undefined') {
      modifier["metric"] = metric;
    }
    if(typeof timezone !== 'undefined') {
      modifier["timezone"] = timezone;
    }
    if(typeof sendDate !== 'undefined') {
      modifier["sendDate"] = sendDate;
    }
    const plan = SendingPlans.findOne(selector);
    if(_.isEmpty(plan)) {
      throw new Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND, `sending plan ${_id} not found`);
    } else {
      return SendingPlans.update(selector, {$set: modifier});
    }
  }
});

export const remove = new ValidatedMethod({
  name: "sendingPlans.remove",
  validate: null,
  run(_id) {
    return SendingPlans.remove({_id});
  }
});

export const getSendingPlans = new ValidatedMethod({
  name: "sendingPlans.getSendingPlans",
  validate: null,
  run({date}) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const nextDay = date.getDate() + 1;
    const selector = {sendDate: {$gte: new Date(year, month, day), $lt: new Date(year, month, nextDay)}, status: "READY"};
    const modifier = {};
    return SendingPlans.find(selector).fetch();
  }
});