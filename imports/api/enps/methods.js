import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import moment from 'moment';
import {IDValidator} from '/imports/utils/index';
import {Accounts} from 'meteor/accounts-base';

// collections
import {eNPS} from './index';
import {Employees, STATUS_ACTIVE} from '/imports/api/employees/index';

// constants
import * as ERROR_CODE from '/imports/utils/error_code';

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
    alias: {
      type: String
    },
    organizationId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    employeeId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    score: {
      type: Number,
      allowedValues: eNPS.allowedScores,
    }
  }).validator(),
  run({_id, alias, organizationId, employeeId, score}) {
    let result = 0;
    if(!this.isSimulation) {
      // have to verify alias before add score
      const
        {_id: leaderId} = Accounts.findUserByUsername(alias),
        employee = Employees.findOne({_id: employeeId, leaderId, organizationId, status: STATUS_ACTIVE})
        ;

      if(!_.isEmpty(employee)) {
        // verify score
        const eNPSScore = eNPS.find({_id, scores: {$elemMatch: {employeeId}}}).count();
        if(eNPSScore === 0) {
          const scoreDate = new Date();
          result = eNPS.update({_id}, { $addToSet: {scores: {employeeId, score, scoreDate}}});
        } else {
          result = 0;
        }
      } else {
        throw new Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND,
          `alias: ${alias}, organizationId: ${organizationId}, employeeId: ${employeeId} 
          miss matched, or inactivated`);
      }
    }

    return result;
  }
});