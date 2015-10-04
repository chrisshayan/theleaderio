function sendEmail(job, cb) {
    var data = job.data;
    Email.send(data.mail);
    if(data.type == 'leaderInvitation') {
        Collections.LeaderRequests.update({_id: data.requestId}, {$set: {status: 2}});
    } else {
        Collections.EmployeeRequests.update({_id: data.requestId}, {$set: {status: 2}});
    }

    job.done();
    cb();
}

Meteor.JC.processJobs('sendEmail', {concurrency: 5}, sendEmail);