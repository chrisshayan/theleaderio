import {Meteor} from 'meteor/meteor';
import {Feedbacks, FEEDBACK_TYPES} from '../index';

const PAGE_SIZE = 10;

Meteor.publish('feedbacks', function(page = 1) {
  check(page, Number);
  if(!this.userId) {
    return this.ready();
  }
  
  const selector = {leaderId: this.userId};
  const option = {
    limit: (page * PAGE_SIZE) + 5,
    sort: {date: -1}
  };
  return Feedbacks.find(selector, option);
  
});

/**
 * Publication for feedback to leader
 */
Meteor.publish('feedbackToLeader', function(page = 1) {
  check(page, Number);
  if(!this.userId) {
    return this.ready();
  }

  const selector = {leaderId: this.userId, type: FEEDBACK_TYPES.EMPLOYEE_TO_LEADER};
  const option = {
    limit: (page * PAGE_SIZE) + 5,
    sort: {date: -1}
  };
  return Feedbacks.find(selector, option);

});

/**
 * Publication for feedback to employee
 */
Meteor.publish('feedbackToEmployee', function(page = 1) {
  check(page, Number);
  if(!this.userId) {
    return this.ready();
  }

  const selector = {leaderId: this.userId, type: FEEDBACK_TYPES.LEADER_TO_EMPLOYEE};
  const option = {
    limit: (page * PAGE_SIZE) + 5,
    sort: {date: -1}
  };
  return Feedbacks.find(selector, option);

});