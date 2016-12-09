import {Meteor} from 'meteor/meteor';
import {SendingPlans} from '../index';

Meteor.publish('sendingPlans', function() {
  if(!this.userId) {
    return this.ready();
  }

  const leaderId = this.userId;
  return SendingPlans.find({leaderId});
});