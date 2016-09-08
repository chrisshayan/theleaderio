import { Meteor } from 'meteor/meteor';
import { Industries } from '../index';

Meteor.publish('industries.list', function() {
  return Industries.find()
});