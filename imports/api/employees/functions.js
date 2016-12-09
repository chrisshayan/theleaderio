import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/alanning:roles';

// collections
import {Employees, STATUS_ACTIVE, STATUS_DEACTIVE } from '/imports/api/employees/index';

// constants
import * as ERROR_CODE from '/imports/utils/error_code';
import {USER_ROLES} from '/imports/api/users/index';

// functions
import {add as addLogs} from '/imports/api/logs/functions';

/**
 * Function disable employee for admin
 * @param email
 * @param mailgunId
 * @param reason
 * @param date
 * @return {{status: boolean, message: string}}
 */
export const disable = ({userId, mailgunId, email, reason, date}) => {
  if (Meteor.isServer) {
    // only admin could disable account
    const adminUserId = this.userId || userId;
    if (!Roles.userIsInRole(adminUserId, USER_ROLES.ADMIN)) {
      throw new Meteor.Error(ERROR_CODE.PERMISSION_DENIED, `user ${adminUserId} is not admin`);
    }
    const
      employees = Employees.find({email}).fetch();
    ;
    let
      result = {
        status: false,
        message: ""
      }
      ;

    if (!_.isEmpty(employees)) {
      employees.map(employee => {
        const
          {_id} = employee,
          status = STATUS_DEACTIVE,
          updatedAt = new Date()
          ;
        Employees.update({ _id }, { $set: { status, updatedAt }});
        // log data here {email, mailgunId, reason, date}
        const params = {
          name: "disabledAccounts",
          content: {mailgunId, email, typeOfUser: "employee", employeeId: _id, action: "disable", reason}
        };
        addLogs({params});
      });
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
};


/**
 * Function disable employee for admin
 * @param email
 * @param mailgunId
 * @param reason
 * @param date
 * @return {{status: boolean, message: string}}
 */
export const enable = ({userId, mailgunId, email, reason, date}) => {
  if (Meteor.isServer) {
    // only admin could disable account
    const adminUserId = this.userId || userId;
    if (!Roles.userIsInRole(adminUserId, USER_ROLES.ADMIN)) {
      throw new Meteor.Error(ERROR_CODE.PERMISSION_DENIED, `user ${adminUserId} is not admin`);
    }
    const
      employees = Employees.find({email}).fetch();
    ;
    let
      result = {
        status: false,
        message: ""
      }
      ;

    if (!_.isEmpty(employees)) {
      employees.map(employee => {
        const
          {_id} = employee,
          status = STATUS_ACTIVE,
          updatedAt = new Date()
          ;
        Employees.update({ _id }, { $set: { status, updatedAt }});
        // log data here {email, mailgunId, reason, date}
        const params = {
          name: "disabledAccounts",
          content: {mailgunId, email, typeOfUser: "employee", employeeId: _id, action: "enable", reason}
        };
        addLogs({params});
      });
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
};