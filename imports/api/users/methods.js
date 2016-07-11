import {Meteor, Error} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {Accounts} from 'meteor/accounts-base';
import _ from 'lodash';

import {IDValidator} from '/imports/utils';
import {Tokens} from '/imports/api/tokens/index';

/**
 *  @summary set alias for account which will use Account username as alias
 *  @param tokenId
 */
export const createAlias = new ValidatedMethod({
  name: 'users.createAlias',
  validate: new SimpleSchema({
    email: {
      type: String
    },
    alias: {
      type: String
    }
  }).validator(),
  run({email, alias}) {
    if (!this.isSimulation) {
      const user = Accounts.findUserByEmail(email);
      if (!_.isEmpty(user)) {
        const userId = user._id;
        Accounts.setUsername(userId, alias);
        const verifyUser = Accounts.findUserByUsername(alias);
        if (_.isEmpty(verifyUser)) {
          throw new Meteor.Error('create-alias-failed',
            `Can not create user alias with email=${email} & alias=${alias}`);
        } else {
          // add alias into alias collection
          // Alias.create.call({alias});
        }
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
      if (alias && email) {
        const user = Accounts.findUserByUsername(alias);
        if (_.isEmpty(user)) {
          throw new Meteor.Error('invalid-alias', `alias ${alias} doesn't exists`);
        } else {
          if (email) {
            const checkUser = Accounts.findUserByEmail(email);
            if (_.isEmpty(checkUser)) {
              throw new Meteor.Error(`email ${email} doesn't exists`);
            } else {
              if (checkUser.username !== user.username) {
                throw new Meteor.Error(`email ${email} doesn't belong to ${alias}`);
              }
            }
          }
        }
      }
      else if (alias) { // alias only
        const user = Accounts.findUserByUsername(alias);
        if (_.isEmpty(user)) {
          throw new Meteor.Error('invalid-alias', `alias ${alias} doesn't exists`);
        } else {
          return true;
        }
      } else if (email) { // email only
        const user = Accounts.findUserByEmail(email);
        if (_.isEmpty(user)) {
          throw new Meteor.Error(`email ${email} doesn't exists`);
        }
      }
    }
  }
});