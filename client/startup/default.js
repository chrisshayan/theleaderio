// Run this when the meteor app is started
Meteor.startup(function () {
    Meteor.subscribe('userProfile');
});