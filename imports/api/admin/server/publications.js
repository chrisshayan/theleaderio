import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/alanning:roles';

// collection
import {Administration} from '../index';

Meteor.publish("administration", function() {
  if(!this.userId) {
    return this.ready();
  }
  if(!Roles.userIsInRole(this.userId, "admin")) {
    return this.ready();
  }

  return Administration.find({});
});