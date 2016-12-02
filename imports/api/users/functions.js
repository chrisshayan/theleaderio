import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {Roles} from 'meteor/alanning:roles';

// functions
import {aliasValidator} from '/imports/utils/index';

// const
import * as ERROR_CODE from '/imports/utils/error_code';
import {USER_ROLES} from './index';

/**
 * Function format characters for alias
 * @param rawKeyword
 * @return {*}
 */
export const formatAlias = (rawAlias) => {
  let alias = "";
  for(let i = 0, max = rawAlias.length; i < max; i++) {
    if(aliasValidator(rawAlias[i])) {
      alias += rawAlias[i].toLowerCase();
    }
  }
  return alias;
};

/**
 * Function check user is inactive or not
 * @param userId
 * @return {*|Boolean}
 */
export const isInactiveUser = ({userId}) => {
  return Roles.userIsInRole(userId, USER_ROLES.INACTIVE);
};

/**
 * Function disable account for admin
 * @param email
 * @param mailId
 * @param reason
 * @param date
 * @return {{status: boolean, message: string}}
 */
export const disableAccount = ({email, mailgunId, reason, date}) => {
  // only admin could disable account
  // if(!Roles.userIsInRole(this.userId, USER_ROLES.ADMIN)) {
  //   throw new Meteor.Error(ERROR_CODE.PERMISSION_DENIED, `user ${this.userId} is not admin`);
  // }
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
      // ....
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
};


/**
 * Function enable account for admin
 * @param email
 * @param mailId
 * @param reason
 * @param date
 * @return {{status: boolean, message: string}}
 */
export const enableAccount = ({email, mailgunId, reason, date}) => {
  // only admin could disable account
  // if(!Roles.userIsInRole(this.userId, USER_ROLES.ADMIN)) {
  //   throw new Meteor.Error(ERROR_CODE.PERMISSION_DENIED, `user ${this.userId} is not admin`);
  // }
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
      // ....
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
};

