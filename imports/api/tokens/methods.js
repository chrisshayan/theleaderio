import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import {Tokens} from './index';
import {IDValidator} from '/imports/utils';

/**
 * @summary generate Token which will be sent to user for validating email and activate user
 * @param email
 */
export const generate = new ValidatedMethod({
  name: 'tokens.generate',
  validate: new SimpleSchema({
    email: {
      type: String
    }
  }).validator(),
  run({email}) {
    return Tokens.insert({email});
  }
});

/**
 * @summary verify Token
 * @param email
 */
export const verify = new ValidatedMethod({
  name: 'tokens.verify',
  validate: new SimpleSchema({
    tokenId: {
      type: String
    }
  }).validator(),
  run({tokenId}) {
    if (!this.isSimulation) {
      const token = Tokens.findOne({_id: tokenId});
      if (token) {
        return true;
      } else {
        throw new Meteor.Error('invalid-token', 'User token is invalid or has been used.');
      }
    }
  }
});



/**
 * @summary remove Token
 * @param email
 */
export const remove = new ValidatedMethod({
  name: 'tokens.remove',
  validate: new SimpleSchema({
    tokenId: {
      type: String
    }
  }).validator(),
  run({tokenId}) {
    if (!this.isSimulation) {
      Tokens.remove({_id: tokenId});
    }
  }
});