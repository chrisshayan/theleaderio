// methods
import {add as addFeedback} from '/imports/api/feedbacks/methods';
import {send as sendEmail} from '/imports/api/email/methods';

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