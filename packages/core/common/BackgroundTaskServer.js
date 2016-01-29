Meteor.JC = JobCollection('background_tasks');

if (Meteor.isServer) {
  Meteor.startup(function() {
    return Meteor.JC.startJobServer();
  });
}
