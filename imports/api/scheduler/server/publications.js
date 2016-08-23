import { Meteor } from 'meteor/meteor';
import { Scheduler } from '../index';

Meteor.publish('Scheduler.list', function(year) {
  if (!this.userId) {
    return this.ready();
  }

  check(year, Number);

  return Scheduler.find({
    userId: this.userId,
    year
  });
});