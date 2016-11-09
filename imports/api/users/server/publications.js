import { Meteor } from 'meteor/meteor';
import {Roles} from 'meteor/alanning:roles';

// collection
import { Preferences } from '../index';
import {Accounts} from 'meteor/accounts-base';

// constants
import * as ERROR_CODE from '/imports/utils/error_code';

Meteor.publish('preferences', function({name}) {
  return Preferences.find({userId: this.userId, name});
});

Meteor.publish("statistic.users", function() {
  if(!this.userId) {
    return this.ready();
  }
  if(!Roles.userIsInRole(this.userId, "admin")) {
    throw new Meteor.Error(ERROR_CODE.PERMISSION_DENIED);
  }

  return Accounts.users.find();
});