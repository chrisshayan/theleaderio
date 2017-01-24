import {Meteor} from 'meteor/meteor';
import {eNPS} from '../index';

Meteor.publish('enps', function() {
  if(!this.userId) {
    return this.ready();
  }
  return eNPS.find({leaderId: this.userId});
});