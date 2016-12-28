import {Meteor} from 'meteor/meteor';
import {Aliases} from '../index';

Meteor.publish("aliases.blacklist", function({alias}) {
  if(!this.userId) {
    return this.ready();
  }

  return Aliases.find();
});