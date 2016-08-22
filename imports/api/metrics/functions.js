import {Meteor} from 'meteor/meteor';

// collections
import {SendingPlans} from '/imports/api/sending_plans/index';
import {Employees} from '/imports/api/employees/index';
import {Defaults } from '/imports/api/defaults/index';

// methods
import * as EmailActions from '/imports/api/email/methods';
import {add as addScore} from './methods';

// constants
import * as ERROR_CODE from '/imports/utils/error_code';

function removeWebGmailClientContent(content) {
  return content.split('\r\n\r\n--');
}

function getRecipientInfo({recipient, sender}) {
  if(typeof recipient == "undefined") {
    return false;
  }
  const recipientElements = recipient.split("-");
  // console.log(recipientElements)
  const
    planId = recipientElements[0],
    organizationId = recipientElements[1]
    ;

  const sendingPlan = SendingPlans.findOne({_id: planId});
  if(!_.isEmpty(sendingPlan)) {
    const {
      leaderId,
      metric,
      timezone
    } = sendingPlan;

    const employee = Employees.findOne({leaderId, organizationId, email: sender});
    if(!_.isEmpty(employee)) {
      const employeeId = employee._id;
      return {planId, employeeId, leaderId, organizationId, metric};
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function onScoringFailed({recipient, sender}) {
  const recipientInfo = getRecipientInfo({recipient, sender});
  if(recipientInfo) {
    const {planId, employeeId, leaderId, organizationId, metric} = recipientInfo;

    const template = 'survey_error';
    const data = {
      planId,
      employeeId,
      leaderId,
      organizationId,
      metric
    };
    EmailActions.send.call({template, data}, (error) => {
      if (!_.isEmpty(error)) {
        console.log(error)
        return error.reason;
      }
    });
    return `resent email to employee ${employeeId} on plan: ${planId};`
  } else {
    return ERROR_CODE.RESOURCE_NOT_FOUND;
  }

}

function onScoringSuccess({recipient, sender, timestamp, score}) {
  const recipientInfo = getRecipientInfo({recipient, sender});
  if(recipientInfo) {
    // console.log({name: `recipient info`, recipientInfo})
    const {planId, employeeId, leaderId, organizationId, metric} = recipientInfo;
    const SCORES = Defaults.findOne({name: "SCORES"}).content;
    const date = new Date(timestamp * 1000);
    const data = {};

    console.log({name: metric, score, planId, leaderId, organizationId, employeeId, date, data})
    // scoring for leader
    addScore.call({name: metric, score, planId, leaderId, organizationId, employeeId, date, data}, (error) => {
      if(!_.isEmpty(error)) {
        return error.reason;
      } else {
        if(score > SCORES.averageScore) {
          const template = 'thankyou';
          const data = {
            type: "scoring",
            planId,
            employeeId,
            leaderId,
            organizationId,
            metric
          };
          EmailActions.send.call({template, data}, (error) => {
            if (!_.isEmpty(error)) {
              console.log(error)
              return error.reason;
            }
          });
          return `scoring for leader: ${leaderId} on plan: ${planId} - done with good score`;
        } else {
          const template = 'feedback';
          const data = {
            planId,
            employeeId,
            leaderId,
            organizationId,
            metric
          };
          EmailActions.send.call({template, data}, (error) => {
            if (!_.isEmpty(error)) {
              console.log(error)
              return error.reason;
            }
          });
          return `scoring for leader: ${leaderId} on plan: ${planId} - done waiting for feedback`;
        }

      }

    });
  } else {
    return ERROR_CODE.RESOURCE_NOT_FOUND;
  }
}

function onFeedbackSuccess({recipient, sender, timestamp, score}) {
  const recipientInfo = getRecipientInfo({recipient, sender});
  if(recipientInfo) {
    const {planId, employeeId, leaderId, organizationId, metric} = recipientInfo;

    const template = 'feedback';
    const data = {
      planId,
      employeeId,
      leaderId,
      organizationId,
      metric
    };
    EmailActions.send.call({template, data}, (error) => {
      if (!_.isEmpty(error)) {
        console.log(error)
        return error.reason;
      }
    });
    return `sent feedback email to employee ${employeeId} on plan: ${planId};`
  } else {
    return ERROR_CODE.RESOURCE_NOT_FOUND;
  }
}

export const scoringLeader = function ({recipient, sender, Subject, timestamp, content}) {
  const score = Number(removeWebGmailClientContent(content)[0]);
  // console.log(`score: ${score}`)
  if (isNaN(score)) {
    return onScoringFailed({recipient, sender});
  }
  if (score > 0 && score <= 5) {
    return onScoringSuccess({recipient, sender, timestamp, score});
  } else {
    return onScoringFailed({recipient, sender});
  }
}

export const feedbackLeader = function ({recipient, sender, Subject, timestamp, content}) {
  const feedback = removeWebGmailClientContent(content)[0];
  console.log({recipient, sender, Subject, timestamp, content, feedback});
  return `send thank you email`;
}