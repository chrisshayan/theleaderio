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

Meteor.publish('statistic.profiles', function() {
  if(!this.userId) {
    return this.ready();
  }
  if(!Roles.userIsInRole(this.userId, "admin")) {
    throw new Meteor.Error(ERROR_CODE.PERMISSION_DENIED);
  }

  return Profiles.find();
});