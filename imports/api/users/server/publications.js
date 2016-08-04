import { Meteor } from 'meteor/meteor';

// collection
import { Preferences } from '../index';

Meteor.publish('preferences', function({name}) {
  return Preferences.find({userId: this.userId, name});
});