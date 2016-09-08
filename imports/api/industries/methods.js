import { Meteor} from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import _ from 'lodash';

import { Industries } from './index';
import { IDValidator } from '/imports/utils';

/**
 * Insert new industry
 */
export const insert = new ValidatedMethod({
  name: 'industries.insert',
  validate: new SimpleSchema({
    name: {
      type: String
    }
  }).validator(),
  run({name}) {
    return Industries.insert({name});
  }
});

/**
 * Update industry by _id with name as modifier
 */
export const update = new ValidatedMethod({
  name: 'industries.update',
  validate: new SimpleSchema({
    ...IDValidator,
    name: {
      type: String
    }
  }).validator(),
  run({_id, name}) {
    return Industries.update(_id,{ $set: {name} });
  }
});

/**
 * Remove industry by _id
 */
export const remove = new ValidatedMethod({
  name: 'industries.remove',
  validate: new SimpleSchema({
    ...IDValidator
  }).validator(),
  run({_id}) {
    return Industries.remove(_id);
  }
});



/**
 * Security: Only allow 5 list operations per connection per second
 */
const METHODS_LIMITER= _.map([
  insert,
  update,
  remove,
], 'name');

if (Meteor.isServer) {
  DDPRateLimiter.addRule({
    name(name) {
      return _.indexOf(METHODS_LIMITER, name);
    },

    // Rate limit per connection ID
    connectionId() {
      return true;
    },
  }, 5, 1000);

}