import {ValidatedMethod} from 'meteor/mdg:validated-method';

// collections
import {Feedbacks} from './index';

export const add = new ValidatedMethod({
  name: "feedbacks.add",
  validate: null,
  run({planId, leaderId, organizationId, employeeId, metric, feedback, date}) {
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
    if(typeof feedback !== 'undefined') {
      doc.feedback = feedback;
    }
    Feedbacks.insert(doc);
  }
});

export const checkExists = new ValidatedMethod({
  name: "feedbacks.checkExists",
  validate: null,
  run({planId, organizationId, employeeId}) {
    const feedbackData = Feedbacks.findOne({planId, organizationId, employeeId});
    if(!_.isEmpty(feedbackData)) {
      return feedbackData.date;
    } else {
      return false;
    }
  }
});