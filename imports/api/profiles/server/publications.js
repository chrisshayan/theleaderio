import { Meteor } from 'meteor/meteor';
import { Profiles } from '../index';

Meteor.publish('profiles', function() {
  return Profiles.find()
});
