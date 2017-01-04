import {Aliases} from './index';
import {ValidatedMethod} from 'meteor/mdg:validated-method';

/**
 * Method add alias
 * @param {String} alias
 * @return {String} aliasId
 */
export const add = new ValidatedMethod({
  name: "Aliases.add",
  validate: new SimpleSchema({
    alias: {
      type: String
    }
  }).validator(),
  run({alias}) {
    if(!this.isSimulation) {
      return Aliases.insert({alias});
    }
  }
});


/**
 * Method remove alias
 * @param {String} alias
 * @return {String} aliasId
 */
export const remove = new ValidatedMethod({
  name: "Aliases.remove",
  validate: new SimpleSchema({
    alias: {
      type: String
    }
  }).validator(),
  run({alias}) {
    if(!this.isSimulation) {
      return Aliases.remove({alias});
    }
  }
});