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
