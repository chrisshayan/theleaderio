import {Meteor} from 'meteor/meteor';
import { Profiles } from '/imports/api/profiles/index';

Meteor.publish("alias.list", function () {
  return Meteor.users.find({}, {fields: {username: 1}});
});

Meteor.publish("aliases", function () {
  return Meteor.users.find({}, {fields: {username: 1}});
});