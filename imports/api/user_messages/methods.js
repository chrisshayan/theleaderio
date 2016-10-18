import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {ValidatedMethod} from 'meteor/mdg:validated-method';

// collections
import {UserMessages} from './index';

// constants
import {STATUS, TYPE} from './index';

/**
 * Method add message to user
 * @param {String} userId
 * @param {String} type
 * @param {Object} message
 * @param {String} status
 * @param {Date} date
 * @return {String} messageId if success
 */
export const add = new ValidatedMethod({
  name: "user_messages.add",
  validate: null,
  run({userId, type, message, status, date}) {
    return UserMessages.insert({userId, type, message, status, date});
  }
});

/**
 * Method set message status
 * @param {String} messageId
 * @param {String} status
 * @return
 */
export const setStatus = new ValidatedMethod({
  name: "user_messages.setStatus",
  validate: new SimpleSchema({
    messageId: {
      type: String
    },
    status: {
      type: String,
      allowedValues: [STATUS.READ, STATUS.UNREAD]
    }
  }).validator(),
  run({messageId, status}) {
    return UserMessages.update({_id: messageId}, {$set: {status}});
  }
});