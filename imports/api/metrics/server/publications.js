import {Meteor} from 'meteor/meteor';
import {Metrics} from '../index';

Meteor.publish('api-metrics', function() {
  return Metrics.find({});
});

Meteor.publish('metrics', function() {
  if (!this.userId) {
    return this.ready();
  }

  return Metrics.find({
    leaderId: this.userId
  }, {
    fields: Metrics.publicFields // for feature: public information which user will define
  });
});