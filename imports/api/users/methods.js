import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {Accounts} from 'meteor/accounts-base';
import _ from 'lodash';

import {IDValidator} from '/imports/utils';
import {Tokens} from '/imports/api/tokens/index';
import * as ProfileActions from '/imports/api/profiles/methods';
import {Profiles, STATUS_ACTIVE} from '/imports/api/profiles/index';
import * as EmailActions from '/imports/api/email/functions';

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
  run({tokenId, alias}) {
    if (!this.isSimulation) {
      // verify Token
      const token = Tokens.findOne({_id: tokenId});
      if (!_.isEmpty(token)) {
        const email = token.email;
        const user = Accounts.findUserByEmail(email);
        if (!_.isEmpty(user)) {
          const userId = user._id;
          Accounts.setUsername(userId, alias);
          const verifyUser = Accounts.findUserByUsername(alias);
          if (_.isEmpty(verifyUser)) {
            throw new Meteor.Error('create-alias-failed',
              `Can not create user alias with tokenId=${tokenId} & alias=${alias}`);
          } else {
            // Activate user
            Meteor.users.update({
              userId,
              emails: {
                $elemMatch: { address: email }
              }}, {
              $set: {
                "emails.$.verified": true
              }
            });
            ProfileActions.setStatus.call({userId, status: STATUS_ACTIVE});
          }
        }
      } else {
        throw new Meteor.Error('invalid-token', 'User token is invalid or has been used.');
      }
    }
  }
});


/**
 *  @summary set alias for account which will use Account username as alias
 *  @param tokenId
 */
export const resetPassword = new ValidatedMethod({
  name: 'users.resetPassword',
  validate: new SimpleSchema({
    tokenId: {
      type: String
    },
    password: {
      type: String
    }
  }).validator(),
  run({tokenId, password}) {
    if (!this.isSimulation) {
      // verify Token
      const token = Tokens.findOne({_id: tokenId});
      if (!_.isEmpty(token)) {
        const email = token.email;
        const user = Accounts.findUserByEmail(email);
        if (!_.isEmpty(user)) {
          const userId = user._id;
          Accounts.setPassword(userId, password);
        }
      } else {
        throw new Meteor.Error('invalid-token', 'User token is invalid or has been used.');
      }
    }
  }
});

export const verifyAlias = new ValidatedMethod({
  name: 'users.verifyAlias',
  validate: new SimpleSchema({
    alias: {
      type: String
    }
  }).validator(),
  run({alias}) {
    // verify user email & alias in server side
    if (!this.isSimulation) {
      const user = Accounts.findUserByUsername(alias);
      if (_.isEmpty(user)) {
        throw new Error('invalid-alias', `alias ${alias} doesn't exists`);
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
});