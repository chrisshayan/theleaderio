import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import moment from 'moment';
import {IDValidator} from '/imports/utils/index';

// collections
import {eNPS} from './index';


/**
 * Method create enps scores
 * @param {String} leaderId
 * @param {String} organizationId
 * @param {String} interval
 * @return {String} enpsId
 */
export const create = new ValidatedMethod({
  name: 'enps.create',
  validate: new SimpleSchema({
    leaderId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    organizationId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    interval: {
      type: String,
      allowedValues: eNPS.allowedIntervals,
      defaultValue: "EVERY_MONTH"
    }
  }).validator(),
  run({leaderId, organizationId, interval}) {
    const
      sendDate = new Date()
      ;
    return eNPS.insert({leaderId, organizationId, interval, sendDate});
  }
});

/**
 * Method add score for a enps of leader
 * @param {String} _id
 * @param {String} employeeId
 * @param {Number} score
 * @return {String} addToSet result
 */
export const addScore = new ValidatedMethod({
  name: 'enps.addScore',
  validate: new SimpleSchema({
    ...IDValidator,
    employeeId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    score: {
      type: Number,
      allowedValues: eNPS.allowedScores,
    }
  }).validator(),
  run({_id, employeeId, score}) {
    const scoreDate = new Date();
    return eNPS.update({_id}, { $addToSet: {scores: {employeeId, score, scoreDate}}});
  }
});