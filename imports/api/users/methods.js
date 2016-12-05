import {Meteor, Error} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {Accounts} from 'meteor/accounts-base';
import _ from 'lodash';
import {Roles} from 'meteor/alanning:roles';

// actions
import * as ProfileActions from '/imports/api/profiles/methods';
import {STATUS_ACTIVE} from '/imports/api/profiles/index';
import {IDValidator} from '/imports/utils';

// collection
import {Tokens} from '/imports/api/tokens/index';
import { Preferences } from '/imports/api/users/index';

// functions
import {formatAlias, isInactiveUser} from '/imports/api/users/functions';
import {add as addLogs} from '/imports/api/logs/functions';

// constants
import * as ERROR_CODE from '/imports/utils/error_code';
import {USER_ROLES} from './index';

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
          Accounts.setUsername(userId, formatAlias(alias));
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
        if(isInactiveUser({userId: user._id})) {
          throw new Meteor.Error(403, 'User account is inactive!');
        }
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
          if(isInactiveUser({userId: user._id})) {
            throw new Meteor.Error(403, 'User account is inactive!');
          }
          return true;
        }
      } else if (email) { // email only
        const user = Accounts.findUserByEmail(email);
        if (_.isEmpty(user)) {
          throw new Meteor.Error(`email ${email} doesn't exists`);
        } else {
          if(isInactiveUser({userId: user._id})) {
            throw new Meteor.Error(403, 'User account is inactive!');
          }
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

/**
 * Method verify admin role
 * @param {String} userId
 * @return {Boolean} true if user has admin role, otherwise is failed
 */
export const verifyAdminRole = new ValidatedMethod({
  name: "users.verifyAdminRole",
  validate: null,
  run({userId}) {
    if(!this.isSimulation) {
      const isAdmin = Roles.userIsInRole(userId, "admin");
      return {
        isAdmin
      };
    }
  }
});

/**
 * Method disable account for admin
 * @param email
 * @param mailgunId
 * @param reason
 * @param date
 * @return {{status: boolean, message: string}}
 */
export const disableAccount = new ValidatedMethod({
  name: "users.disableAccount",
  validate: null,
  run({userId, mailgunId, email, reason, date}) {
    if(!this.isSimulation) {
      // only admin could disable account
      const adminUserId = this.userId || userId;
      if(!Roles.userIsInRole(adminUserId, USER_ROLES.ADMIN)) {
        throw new Meteor.Error(ERROR_CODE.PERMISSION_DENIED, `user ${adminUserId} is not admin`);
      }
      const
        user = Accounts.findUserByEmail(email)
        ;
      let
        result = {
          status: false,
          message: ""
        }
        ;

      if(!_.isEmpty(user)) {
        const userId = user._id;
        if(!Roles.userIsInRole(userId, USER_ROLES.INACTIVE)) {
          Roles.addUsersToRoles(userId, USER_ROLES.INACTIVE);
          // log data here {email, mailgunId, reason, date}
          const params = {
            name: "disabledAccounts",
            content: {mailgunId, email, typeOfUser: "leader", action: "disable", reason}
          };
          addLogs({params});
        }
        result = {
          status: true,
          message: `${email} had been disabled.`
        };
      } else {
        result = {
          status: false,
          message: `${email} doesn't exists.`
        };
      }
      return result;
    }
  }
});


/**
 * Method enable account for admin
 * @param email
 * @param mailgunId
 * @param reason
 * @param date
 * @return {{status: boolean, message: string}}
 */
export const enableAccount = new ValidatedMethod({
  name: "users.enableAccount",
  validate: null,
  run({userId, email, mailgunId, reason, date}) {
    if(!this.isSimulation) {
      // only admin could disable account
      const adminUserId = this.userId || userId;
      if(!Roles.userIsInRole(adminUserId, USER_ROLES.ADMIN)) {
        throw new Meteor.Error(ERROR_CODE.PERMISSION_DENIED, `user ${adminUserId} is not admin`);
      }
      const
        user = Accounts.findUserByEmail(email)
        ;
      let
        result = {
          status: false,
          message: ""
        }
        ;

      if(!_.isEmpty(user)) {
        const userId = user._id;
        if(Roles.userIsInRole(userId, USER_ROLES.INACTIVE)) {
          Roles.removeUsersFromRoles(userId, USER_ROLES.INACTIVE);
          // log data here {email, mailgunId, reason, date}
          const params = {
            name: "disabledAccounts",
            content: {mailgunId, email, typeOfUser: "leader", action: "enable", reason}
          };
          addLogs({params});
        }
        result = {
          status: true,
          message: `${email} had been enabled.`
        };
      } else {
        result = {
          status: false,
          message: `${email} doesn't exists.`
        };
      }
      return result;
    }
  }
});
