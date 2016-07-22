import { Meteor } from 'meteor/meteor';

// collection
import { Configs } from '../index';

Meteor.publish('configs', function({name}) {
  return Configs.find({userId: this.userId, name});
});

