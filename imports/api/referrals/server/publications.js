import {Meteor} from 'meteor/meteor';

// collections
import {Referrals} from '../index';

Meteor.publish('referrals', function () {
  if(!this.userId) {
    return this.ready();
  }

  return Referrals.find({leaderId: this.userId});
});

Meteor.publish('referrals.cancellation', function ({_id}) {
  if(_.isEmpty(_id)) {
    return this.ready();
  }

  return Referrals.find({_id});
});