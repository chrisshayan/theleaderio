import {
  LogsSendingPlan
} from './index';

/**
 * Function add log
 * @param {String} logName
 * @param {Object} content
 *
 * Sending Plan Log Content:
 * {String} planId
 * {Number} noOfActiveOrgs
 * {Array} details
 *    {String} orgId
 *    {Number} noOfQueuedEmailsToEmployees
 * {Date} date
 */
export const add = ({params}) => {
  const
    {name, content} = params;
  switch (name) {
    case "sending_plan": {
      LogsSendingPlan.insert(content);
      break;
    }
    default: {
      throw new Meteor.Error(`Unknown logName: ${name}`);
    }
  }
}