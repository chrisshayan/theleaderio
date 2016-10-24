import {Meteor} from 'meteor/meteor';

// collection
import {Articles} from '../index';

Meteor.publish('articles', function() {
  if(!this.userId) {
    return this.ready();
  }
  return Articles.find();
});