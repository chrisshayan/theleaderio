import {Meteor, Error} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {Accounts} from 'meteor/accounts-base';
import _ from 'lodash';

// actions
import * as ProfileActions from '/imports/api/profiles/methods';
import {STATUS_ACTIVE} from '/imports/api/profiles/index';
import {IDValidator} from '/imports/utils';

// collection
import {Tokens} from '/imports/api/tokens/index';
import { Preferences } from '/imports/api/users/index';

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
        if (typeof user.username === 'undefined') {
          const userId = user._id;
          Accounts.setUsername(userId, alias);
          const verifyUser = Accounts.findUserByUsername(alias);
          if (_.isEmpty(verifyUser)) {
            throw new Meteor.Error('create-alias-failed',
              `Can not create user alias with email=${email} & alias=${alias}`);
          } else {
            // add alias into profiles collection
            return userId;
          }
        } else {
          throw new Meteor.Error('create-alias-failed',
            `Account email=${email} have alias already`);
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

/**
 *  @summary verify user email & alias in server side
 *  @param alias, email
 */
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


/**
 *  @summary confirm user email address
 *  @param email
 */
export const confirm = new ValidatedMethod({
  name: 'users.confirm',
  validate: new SimpleSchema({
    tokenId: {
      type: String
    }
  }).validator(),
  run({tokenId}) {
    if (!this.isSimulation) {
      // verify Token
      const token = Tokens.findOne({_id: tokenId});
      if (!_.isEmpty(token)) {
        const
          email = token.email,
          user = Accounts.findUserByEmail(email);
        if (!_.isEmpty(user)) {
          const {_id} = user;
          // Activate user
          Meteor.users.update({
            _id,
            emails: {
              $elemMatch: {address: email}
            }
          }, {
            $set: {
              "emails.$.verified": true
            }
          });
          ProfileActions.setStatus.call({userId: _id, status: STATUS_ACTIVE});
        }
      } else {
        throw new Meteor.Error('invalid-token', 'User token is invalid or has been used.');
      }
    }
  }
});

/**
 *  @summary add configuration for user
 *  @param name, configs
 */
export const addPreferences = new ValidatedMethod({
  name: 'users.addPreferences',
  validate: null,
  run({name, preferences, userId}) {
    Preferences.insert({name, preferences, userId});
  }
});

/**
 *  @summary add configuration for user
 *  @param name, configs
 */
export const updatePreferences = new ValidatedMethod({
  name: 'users.updatePreferences',
  validate: null,
  run({name, preferences}) {
    const selector = {
      userId: Meteor.userId(),
      name
    };
    Preferences.update(selector, { $set: {preferences}});
  }
});