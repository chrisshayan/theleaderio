import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// collections
import {eNPS} from './index';


/**
 * Function create enps scores
 * @param {String} leaderId
 * @param {String} organizationId
 * @param {String} interval
 * @return {String} enpsId
 */
export const create = ({leaderId, organizationId, interval}) => {
  const
    sendDate = new Date()
    ;
  return eNPS.insert({leaderId, organizationId, interval, sendDate});
};