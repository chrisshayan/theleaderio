import {Meteor} from 'meteor/meteor';

// collections
import {Defaults} from '/imports/api/defaults/index';

// methods
import {send as sendEmail} from '/imports/api/email/methods';
import {add as addScore} from './methods';

// functions
import {arrayAverage} from '/imports/utils/index';

function onScoringFailed({planId, employeeId, leaderId, organizationId, metric}) {
  const template = 'survey_error';
  const data = {
    planId,
    employeeId,
    leaderId,
    organizationId,
    metric
  };
  sendEmail.call({template, data}, (error) => {
    if (!_.isEmpty(error)) {
      // console.log(error)
      return error.reason;
    }
  });
  return `resent email to employee ${employeeId} on plan: ${planId};`
}

function onScoringSuccess({planId, employeeId, leaderId, organizationId, metric, timestamp, score, SCORES}) {
  const date = new Date(timestamp * 1000);

  // scoring for leader
  addScore.call({metric, score, planId, leaderId, organizationId, employeeId, date}, (error) => {
    if (!_.isEmpty(error)) {
      return error.reason;
    } else {
      if (score > SCORES.averageScore) {
        const template = 'thankyou';
        const data = {
          type: "scoring",
          planId,
          employeeId,
          leaderId,
          organizationId,
          metric
        };
        sendEmail.call({template, data}, (error) => {
          if (!_.isEmpty(error)) {
            // console.log(error)
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
        sendEmail.call({template, data}, (error) => {
          if (!_.isEmpty(error)) {
            // console.log(error)
            return error.reason;
          }
        });
        return `scoring for leader: ${leaderId} on plan: ${planId} - done waiting for feedback`;
      }
    }
  });
}

export const scoringLeader = ({planId, employeeId, leaderId, organizationId, metric, timestamp, score}) => {
  if (isNaN(score)) {
    return onScoringFailed({planId, employeeId, leaderId, organizationId, metric});
  }
  const SCORES = Defaults.findOne({name: "SCORES"}).content;
  if (score > SCORES.minScore && score <= SCORES.maxScore) {
    return onScoringSuccess({planId, employeeId, leaderId, organizationId, metric, timestamp, score, SCORES});
  } else {
    return onScoringFailed({planId, employeeId, leaderId, organizationId, metric});
  }
}

/**
 * Function get average value of metrics for metric box
 * @param {Array} data - an array of metrics object
 * @return {Object} average value of metrics
 */
export const getAverageMetrics = (data) => {
  let
    metrics = {
      overall: null,
      purpose: null,
      meetings: null,
      rules: null,
      communications: null,
      leadership: null,
      workload: null,
      energy: null,
      stress: null,
      decision: null,
      respect: null,
      conflict: null
    }
  ;

  metrics = {
    overall: arrayAverage(data.overall),
    purpose: arrayAverage(data.purpose),
    meetings: arrayAverage(data.meetings),
    rules: arrayAverage(data.rules),
    communications: arrayAverage(data.communications),
    leadership: arrayAverage(data.leadership),
    workload: arrayAverage(data.workload),
    energy: arrayAverage(data.energy),
    stress: arrayAverage(data.stress),
    decision: arrayAverage(data.decision),
    respect: arrayAverage(data.respect),
    conflict: arrayAverage(data.conflict)
  }

  return metrics;
}