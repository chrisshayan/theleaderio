Collections.Surveys = new Mongo.Collection("surveys");
Collections.Surveys.attachSchema(Schemas.Survey);

var allowEmployee = function(userId, doc) {
    return Roles.userIsInRole(userId, [ROLE.EMPLOYEE]);
}
Collections.Surveys.allow({
	insert: allowEmployee
});

Collections.Surveys.before.insert(function(userId, doc){
    var points = [
        doc.goalRating,
        doc.meetingRating,
        doc.groundRulesRating,
        doc.communicationRating,
        doc.leadershipRating,
        doc.workloadRating,
        doc.energyRating,
        doc.stressRating,
        doc.decisionRating,
        doc.respectRating,
        doc.conflictRating
    ];
    var overall = points.reduce(function(a, b) { return a + b;}) / points.length;
    if(overall) {
        doc.overall = overall.toFixed(2);
    }

	doc.createdAt = new Date();
	doc.createdBy = userId;

    var leader = Meteor.user().leader();
    if(!leader) return null;
    doc.leaderId = leader._id;
});