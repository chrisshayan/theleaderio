import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/alanning:roles'

// collections
import {AdminJobs} from '/imports/api/jobs/collections';

Meteor.publish('adminJobs', function() {
  if(!!this.userId) {
    if(!Roles.userIsInRole(this.userId, "admin")) {
      return this.stop();
    }
  }
  if(!this.userId) {
    return this.ready();
  }

  return AdminJobs.find();
});