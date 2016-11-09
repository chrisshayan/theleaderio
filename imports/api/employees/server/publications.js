import {Meteor} from 'meteor/meteor';
import {Employees} from '../index';

Meteor.publish('employees', function() {
  if(!this.userId) {
    return this.ready();
  }
  
  return Employees.find({leaderId: this.userId}, {
    fields: Employees.publicFields
  });
  
});


Meteor.publish("statistic.employees", function() {
  if(!this.userId) {
    return this.ready();
  }
  if(!Roles.userIsInRole(this.userId, "admin")) {
    throw new Meteor.Error(ERROR_CODE.PERMISSION_DENIED);
  }

  return Employees.find();
});