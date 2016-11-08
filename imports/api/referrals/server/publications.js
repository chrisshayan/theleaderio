import {Meteor} from 'meteor/meteor';

// collections
import {Referrals} from '../index';

Meteor.publish('referrals', function () {
  if(!this.userId) {
    return this.ready();
  }

  return Referrals.find({leaderId: this.userId});
});