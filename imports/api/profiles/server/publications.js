import { Meteor } from 'meteor/meteor';
import { Profiles } from '../index';

Meteor.publish('profiles', function() {
  if (!this.userId) {
    return this.ready();
  }

  return Profiles.find({
    userId: this.userId
  }, {
    fields: Profiles.publicFields // for feature: public information which user will define
  });
});
