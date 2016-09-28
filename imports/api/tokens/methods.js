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
    },
    action: {
      type: String,
      allowedValues: ['email', 'password', 'alias', 'migration'],
      optional: true
    }
  }).validator(),
  run({email, action}) {
    return Tokens.insert({email, action});
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
    },
    action: {
      type: String
    }
  }).validator(),
  run({tokenId, action}) {
    if (!this.isSimulation) {
      const token = Tokens.findOne({_id: tokenId, action});
      if (token) {
        return token.email;
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
    },
    action: {
      type: String
    }
  }).validator(),
  run({tokenId, action}) {
    if (!this.isSimulation) {
      console.log(Tokens.remove({_id: tokenId, action}));
    }
  }
});