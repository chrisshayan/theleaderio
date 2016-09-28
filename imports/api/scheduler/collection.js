import { Mongo } from 'meteor/mongo';
import { SendingPlans } from '/imports/api/sending_plans';
import * as schedulerUtils from '/imports/utils/scheduler';

export default class SchedulerCollection extends Mongo.Collection {
  insert(doc, callback) {
    const
      _id = super.insert(doc, callback),
      data = this.findOne({_id})
      ;
    if(_id) {
      this.updateSendingPlan(data)
    }
    return _id;
  }

  update(selector, modifier) {
    const before = this.findOne(selector);
    const result = super.update(selector, modifier);
    if(result) {
      if(Meteor.isServer) {
        const after = this.findOne(selector);
        let hasChange = !_.isEqual(before.metrics, after.metrics);
        hasChange |= !_.isEqual(before.interval, after.interval);
        hasChange && this.updateSendingPlan(after)
      }
    }
    return result;
  }

  updateSendingPlan(doc) {
    if(Meteor.isServer) {
      // remove all sending plan existing that status is READY
      SendingPlans.remove({
        schedulerId: doc._id,
        status: 'READY'
      });

      if(_.isEmpty(doc.metrics)) return;

      // generate new sending plan
      const leaderId = doc.userId;
      const schedulerId = doc._id;
      let metricIdx = 0;
      const plans = schedulerUtils.generateSendingPlan(doc.quarter, doc.interval);

      _.each(plans, sendDate => {
        const newPlan = {
          leaderId,
          schedulerId,
          metric: doc.metrics[metricIdx],
          sendDate,
          status: 'READY'
        };

        SendingPlans.insert(newPlan);

        if(metricIdx+1 >= doc.metrics.length) {
          metricIdx = 0;
        } else {
          metricIdx++;
        }
      });
    }
  }
}