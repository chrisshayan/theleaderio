import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {Accounts} from 'meteor/accounts-base';
import _ from 'lodash';

import {IDValidator} from '/imports/utils';
import {Tokens} from '/imports/api/tokens/index';
import * as ProfileActions from '/imports/api/profiles/methods';
import {STATUS_ACTIVE} from '/imports/api/profiles/index';

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

// verify user email & alias in server side
export const verify = new ValidatedMethod({
  name: 'users.verify',
  validate: new SimpleSchema({
    alias: {
      type: String,
      optional: true
    }, 
    email: {
      type: String,
      optional: true
    }
  }).validator(),
  run({alias, email}) {
    if (!this.isSimulation) {
      // both alias & email
      if(alias && email) {
        const user = Accounts.findUserByUsername(alias);
        if (_.isEmpty(user)) {
          throw new Error('invalid-alias', `alias ${alias} doesn't exists`);
        } else {
          if(email) {
            const checkUser = Accounts.findUserByEmail(email);
            if(_.isEmpty(checkUser)) {
              throw new Error(`email ${email} doesn't exists`);
            } else {
              if(checkUser.username !== user.username) {
                throw new Error(`email ${email} doesn't belong to ${alias}`);
              }
            }
          }
        }
      }
      else if(alias) { // alias only
        const user = Accounts.findUserByUsername(alias);
        if (_.isEmpty(user)) {
          throw new Error('invalid-alias', `alias ${alias} doesn't exists`);
        } else {
          return true;
        }
      } else if(email) { // email only
        const user = Accounts.findUserByEmail(email);
        if(_.isEmpty(user)) {
          throw new Error(`email ${email} doesn't exists`);
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
});