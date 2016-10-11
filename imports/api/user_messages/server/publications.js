import {Meteor} from 'meteor/meteor';
import {UserMessages} from '../index';

Meteor.publish('user_messages', function() {
  if(!this.userId) {
    return this.ready();
  }

  return UserMessages.find({userId: this.userId});
});