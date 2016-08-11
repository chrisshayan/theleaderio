import { Meteor } from 'meteor/meteor';
import { Scheduler } from '../index';

Meteor.publish('scheduler', function() {
  if (!this.userId) {
    return this.ready();
  }

  return Scheduler.find({
    userId: this.userId
  });
});