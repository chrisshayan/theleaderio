import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {Roles} from 'meteor/alanning:roles';

// collection
import {Administration} from './index';

// constants
import * as ERROR_CODE from '/imports/utils/error_code';

/**
 * Method add admin configuration
 * @param {String} type
 * @param {String} name
 * @param {Object} data
 * @return {String} doc id if success
 */
export const add = new ValidatedMethod({
  name: "administration.add",
  validate: null,
  run({type, name, data}) {
    if(!this.isSimulation) {
      return Administration.insert({type, name, data});
    }
  }
});

/**
 * Method edit admin configuration
 * @param {String} _id
 * @param {String} type
 * @param {String} name
 * @param {Object} data
 * @return {String} doc id if success
 */
export const edit = new ValidatedMethod({
  name: "administration.edit",
  validate: null,
  run({type, name, data}) {
    if(!this.isSimulation) {
      return Administration.update({type, name}, {$set: {type, name, data}}, {upsert: true});
    }
  }
});

