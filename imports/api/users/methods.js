import {Meteor, Error} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {Accounts} from 'meteor/accounts-base';
import _ from 'lodash';
import {Roles} from 'meteor/alanning:roles';
import moment from 'moment';

// actions
import * as ProfileActions from '/imports/api/profiles/methods';
import {STATUS_ACTIVE} from '/imports/api/profiles/index';
import {IDValidator} from '/imports/utils';

// collection
import {Tokens} from '/imports/api/tokens/index';
import { Preferences } from '/imports/api/users/index';

// methods
import {create as createProfile} from '/imports/api/profiles/methods';
import {generate as createToken} from '/imports/api/tokens/methods';
import { create as createScheduler } from '/imports/api/scheduler/methods';
import {remove as removeAlias} from '/imports/api/alias/methods';

// functions
import {formatAlias, isInactiveUser} from '/imports/api/users/functions';
import {add as addLogs} from '/imports/api/logs/functions';
import {isAliasInBlacklist} from '/imports/api/alias/functions';

// constants
import * as ERROR_CODE from '/imports/utils/error_code';
import {USER_ROLES} from './index';
import {DEFAULT_PUBLIC_INFO_PREFERENCES} from '/imports/utils/defaults';
import { DEFAULT_SCHEDULER } from '/imports/utils/defaults';

// logger
// import {Logger} from '/imports/api/logger/index';

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

export const isAliasExists = new ValidatedMethod({
  name: "users.isAliasExists",
  validate: new SimpleSchema({
    alias: {
      type: String
    }
  }).validator(),
  run({alias}) {
    if(!this.isSimulation) {
      let result = {
        exists: true
      };
      // verify in users account
      const user = Accounts.findUserByUsername(alias);
      if(_.isEmpty(user)) {
        result.exists = isAliasInBlacklist({alias});
      }
      return result;
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
          // add user into inactive group
          Roles.addUsersToRoles(userId, USER_ROLES.INACTIVE);
          // force logout all connection of this user
          Accounts.users.update({_id: userId}, {$set: {"services.resume.loginTokens": []}});
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


export const initiateUserInformation = new ValidatedMethod({
  name: 'users.finishUserCreation',
  validate: new SimpleSchema({
    userId: {
      type: String
    },
    email: {
      type: String
    },
    alias: {
      type: String
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String,
      optional: true
    },
    timezone: {
      type: String,
      optional: true
    },

  }).validator(),
  run({userId, email, alias, firstName, lastName, timezone}) {
    let result = {};
    if(!this.isSimulation) {
      // create user's profile
      createProfile.call({userId, firstName, lastName, timezone}, (error, profileId) => {
        if(!error) { // create profile success
          // create user's default preference
          addPreferences.call({name: 'publicInfo', preferences: DEFAULT_PUBLIC_INFO_PREFERENCES, userId});

          // create user's scheduler
          // check if at the last week of year
          // create scheduler for new year
          DEFAULT_SCHEDULER.map(scheduler => {
            const year = moment().year();
            const {quarter, metrics} = scheduler;
            createScheduler.call({year, quarter, metrics}, (error) => {
              if(error) {
                // Logger.warn({
                //   name: `method - ${this.name}`,
                //   message: JSON.stringify({userId, type: 'CREATE_SCHEDULER_FAILED', detail: error.reason})
                // });
              }
            });
          });
          result = {...result, profileId};

          // create email confirmation token
          createToken.call({email, action: 'email'}, (error, tokenId) => {
            if(!error) { // token create success
              result = {...result, tokenId};
            } else {
              // Logger.warn({
              //   name: `method - ${this.name}`,
              //   message: JSON.stringify({userId, type: 'CREATE_TOKEN_FAILED', detail: error.reason})
              // });
            }
          });
        } else { // create profile failed
          // Logger.warn({
          //   name: `method - ${this.name}`,
          //   message: JSON.stringify({userId, type: 'CREATE_PROFILE_FAILED', detail: error.reason})
          // });
        }
      });

      // remove alias from blacklist
      removeAlias.call({alias});
    }
    return result;
  }
});