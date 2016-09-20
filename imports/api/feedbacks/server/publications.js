import {Meteor} from 'meteor/meteor';
import {Feedbacks} from '../index';

const PAGE_SIZE = 10;

Meteor.publish('feedbacks', function(page = 1) {
  check(page, Number);
  if(!this.userId) {
    return this.ready();
  }

  Meteor._sleepForMs(2000);

  const selector = {leaderId: this.userId};
  const option = {
    limit: (page * PAGE_SIZE) + 5,
    sort: {date: -1}
  };
  return Feedbacks.find(selector, option);
  
});
