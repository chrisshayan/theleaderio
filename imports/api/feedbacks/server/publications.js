import {Meteor} from 'meteor/meteor';
import {Feedbacks} from '../index';

Meteor.publish('feedbacks', function() {
  if(!this.userId) {
    return this.ready();
  }
  
  return Feedbacks.find({leaderId: this.userId}, {
    fields: Feedbacks.publicFields
  });
  
});
