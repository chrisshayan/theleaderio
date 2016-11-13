import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/alanning:roles';

// collections
import {LogsEmail} from '../index';

// constants
import * as ERROR_CODE from '/imports/utils/error_code';

Meteor.publish('logs.email', function() {
  // login user
  if(!this.userId) {
    return this.ready();
  }
  // admin only
  if(!Roles.userIsInRole(this.userId, "admin")) {
    throw new Meteor.Error(ERROR_CODE.PERMISSION_DENIED);
  }

  return LogsEmail.find();

});