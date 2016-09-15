import {Meteor} from 'meteor/meteor';

// collections
import {Measures} from '../index';

Meteor.publish('measures', function() {
  if(!this.userId) {
    return this.ready();
  }
  return Measures.find({leaderId: this.userId}, {
    fields: Measures.publicFields
  });
});