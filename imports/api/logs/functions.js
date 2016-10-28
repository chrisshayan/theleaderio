import {Meteor} from 'meteor/meteor';
import {
  LogsSendingPlan,
  LogsDigest,
  LogsEmail
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
 *
 * Digest Log Content:
 * {String} interval (weekly)
 * {Array} details
 *    {String} leaderId
 *    {String} status (sent | failed)
 * {Date} date
 *
 * Mail Log Content
 * {String} name
 * {Object} content
 *    {String} Subject
 *    {String} From
 *    {String} To
 *    {String} template
 *    {Object} data
 * {Date} date
 */
export const add = ({params}) => {
  const
    {name, content} = params,
    date = new Date()
    ;
  switch (name) {
    case "sending_plan": {
      LogsSendingPlan.insert({content, date});
      break;
    }
    case "digest": {
      LogsDigest.insert({content, date});
      break;
    }
    case "sendEmail": {
      LogsEmail.insert({name, content, date});
      break;
    }
    default: {
      throw new Meteor.Error(`Unknown logName: ${name}`);
    }
  }
}