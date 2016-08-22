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

function getRecipientInfo({recipient, sender}) {
  if(typeof recipient == "undefined") {
    return ERROR_CODE.RESOURCE_NOT_FOUND;
  }
  const recipientElements = recipient.split("-");
  const
    planId = recipientElements[0],
    organizationId = recipientElements[1]
    ;

  const sendingPlan = SendingPlans.findOne({_id: planId});
  const {
    leaderId,
    metric,
    timezone
  } = sendingPlan;

  const employee = Employees.findOne({leaderId, organizationId, email: sender});
  const employeeId = employee._id;
  
  return {planId, employeeId, leaderId, organizationId, metric};
}

function onScoringFailed({recipient, sender}) {
  const {planId, employeeId, leaderId, organizationId, metric} = getRecipientInfo({recipient, sender});

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
}

function onScoringSuccess({recipient, sender, timestamp, score}) {
  const SCORES = Defaults.findOne({name: "SCORES"}).content;
  const {planId, employeeId, leaderId, organizationId, metric} = getRecipientInfo({recipient, sender});
  const date = new Date(timestamp * 1000);
  const data = {};
  // scoring for leader
  addScore.call({name: metric, score, planId, leaderId, organizationId, employeeId, date, data}, (error) => {
    if(!_.isEmpty(error)) {
      return error.reason;
    } else {
      if(score > SCORES.averageScore) {
        const template = 'thankyou';
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

}

export const scoringLeader = function ({recipient, sender, Subject, timestamp, content}) {
  const score = Number(content);
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
  const feedback = content;
  return `send thank you email`;
}