import {Meteor} from 'meteor/meteor';
import {Questions} from '../index';

Meteor.publish('questions', function () {
  if(!this.userId) {
    return this.ready();
  }
  return Questions.find({leaderId: this.userId}, {fields: Questions.publicFields});
});