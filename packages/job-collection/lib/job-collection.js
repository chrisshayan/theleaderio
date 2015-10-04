Meteor.JC = JobCollection('job_collection');
JobQueue = Job;

Meteor.startup(function () {
    return Meteor.JC.startJobServer();
});