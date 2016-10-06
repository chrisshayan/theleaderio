// methods
import {add as addFeedback} from '/imports/api/feedbacks/methods';
import {send as sendEmail} from '/imports/api/email/methods';

// logger
import {Logger} from '/imports/api/logger/index';

export const feedbackLeader = ({planId, employeeId, leaderId, organizationId, metric, timestamp, feedback}) => {
  const date = new Date(timestamp * 1000);

  addFeedback.call({planId, leaderId, organizationId, employeeId, metric, feedback, date}, (error) => {
    if (!_.isEmpty(error)) {
      return error.reason;
    } else {
      const template = 'thankyou';
      const data = {
        type: "feedback",
        planId,
        employeeId,
        leaderId,
        organizationId,
        metric
      };
      sendEmail.call({template, data}, (error) => {
        if (!_.isEmpty(error)) {
          console.log(error)
          return error.reason;
        }
      });
      return `feedback for leader: ${leaderId} on plan: ${planId} - done`;
    }
  });
}

export const feedbackEmployee = ({employeeId, leaderId, organizationId, timestamp, feedback, type}) => {
  const date = new Date(timestamp * 1000);
  addFeedback.call({employeeId, leaderId, organizationId, feedback, type, date}, (error) => {
    if (!_.isEmpty(error)) {
      return error.reason;
    } else {
      const template = 'thankyou';
      const data = {
        type: "feedback",
        employeeId,
        leaderId,
        organizationId
      };
      sendEmail.call({template, data}, (error) => {
        if (!_.isEmpty(error)) {
          Logger.error({name: "feedback", message: {detail: error.reason}});
          return error.reason;
        }
      });
      return `feedback for leader: ${leaderId} on plan: ${planId} - done`;
    }
  });
}