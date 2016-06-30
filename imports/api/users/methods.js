import { Meteor } from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import { Accounts } from 'meteor/accounts-base';
import _ from 'lodash';

import { IDValidator } from '/imports/utils';
import { Tokens } from '/imports/api/tokens/index';

/**
 *  @summary set alias for account which will use Account username as alias
 *  @param tokenId
 */
export const createAlias = new ValidatedMethod({
  name: 'users.createAlias',
  validate: new SimpleSchema({
    tokenId: {
      type: String
    },
    alias: {
      type: String
    }
  }).validator(),
  run({ tokenId, alias }) {
    if(!this.isSimulation) {
      // verify Token
      const token = Tokens.findOne({ _id: tokenId });
      if(!_.isEmpty(token)) {
        const email = token.email;
        const user = Accounts.findUserByEmail(email);
        if(!_.isEmpty(user)) {
          const userId = user._id;
          Accounts.setUsername(userId, alias);
          const verifyUser = Accounts.findUserByUsername(alias);
          if(_.isEmpty(verifyUser)) {
            throw new Meteor.Error('create-alias-failed',
              `Can not create user alias with tokenId=${tokenId} & alias=${alias}`);
          }
        }
      } else {
        throw new Meteor.Error('invalid-token', 'User token is invalid or has been used.');
      }
    }
  }
});

/**
 *  @summary reset user's password
 *  @param email
 */
export const resetPassword = new ValidatedMethod({
  name: 'users.resetPassword',
  validate: new SimpleSchema({
    alias: {
      type: String
    },
    email: {
      type: String
    }
  }).validator(),
  run({ alias, email }) {
    // verify user email & alias in server side
    if(!this.isSimulation) {
      const user = Accounts.findUserByEmail(email);
      if(!_.isEmpty(user)) {
        const username = user.username;
        if(username !== alias) {
          Session.set("resetPasswordValidate", `alias ${alias} doesn't belong to ${email}`);
          throw new Error('invalid-alias', `alias ${alias} doesn't belong to ${email}`);
        }
      } else {
        Session.set("resetPasswordValidate", `User not found`);
        throw new Error('invalid-user', 'user not found');
      }
    }
  }
});