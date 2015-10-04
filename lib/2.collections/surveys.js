Collections.Surveys = new Mongo.Collection("surveys");
Collections.Surveys.attachSchema(Schemas.Survey);

Collections.SurveyStatistics = new Mongo.Collection("survey_statistics");

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
        doc.overall = +overall.toFixed(2);
    }

	doc.createdAt = new Date();
	doc.createdBy = userId;

    var leader = Meteor.user().leader();
    if(!leader) return null;
    doc.leaderId = leader._id;
});


if(Meteor.isServer) {
    function generateReport(userId, doc) {
        Meteor.defer(function() {
            // generate report for current month
            var start = new Date();
            start.setDate(1);
            start.setHours(0);
            start.setMinutes(0);
            start.setSeconds(0);

            var results = Collections.Surveys.aggregate([
                {
                    $match: {
                        leaderId: doc.leaderId,
                        createdAt: {
                            $gte: start
                        }
                    }
                },
                {
                    $group: {
                        _id: {year: {$year: "$createdAt"}, month: {$month: "$createdAt"}},
                        goalRating: {$avg: "$goalRating"},
                        meetingRating: {$avg: "$meetingRating"},
                        groundRulesRating: {$avg: "$groundRulesRating"},
                        communicationRating: {$avg: "$communicationRating"},
                        leadershipRating: {$avg: "$leadershipRating"},
                        workloadRating: {$avg: "$workloadRating"},
                        energyRating: {$avg: "$energyRating"},
                        stressRating: {$avg: "$stressRating"},
                        decisionRating: {$avg: "$decisionRating"},
                        respectRating: {$avg: "$respectRating"},
                        conflictRating: {$avg: "$conflictRating"},
                        overall: {$avg: "$overall"}
                    }
                }
            ]);

            _.each(results, function(result) {
                Collections.SurveyStatistics.upsert({
                    leaderId: doc.leaderId,
                    year: result._id.year,
                    month: result._id.month,
                }, {
                    $set: {
                        leaderId: doc.leaderId,
                        year: result._id.year,
                        month: result._id.month,
                        goalRating: +result.goalRating.toFixed(2),
                        meetingRating: +result.meetingRating.toFixed(2),
                        groundRulesRating: +result.groundRulesRating.toFixed(2),
                        communicationRating: +result.communicationRating.toFixed(2),
                        leadershipRating: +result.leadershipRating.toFixed(2),
                        workloadRating: +result.workloadRating.toFixed(2),
                        energyRating: +result.energyRating.toFixed(2),
                        stressRating: +result.stressRating.toFixed(2),
                        decisionRating: +result.decisionRating.toFixed(2),
                        respectRating: +result.respectRating.toFixed(2),
                        conflictRating: +result.conflictRating.toFixed(2),
                        overall: +result.overall.toFixed(2),
                    }
                })
            });
        });
    }

    function addToFeeds(userId, doc) {
        Meteor.defer(function() {
            var feed = new Feed();
            feed.type = 2;
            feed.createdBy = userId;
            feed.createdAt = new Date();
            feed.followers = [userId, doc.leaderId];
            feed.data = {
                typeId: doc._id,
                leaderId: doc.leaderId,
                overall: doc.overall
            };
            feed.save();
        });
    }

    Collections.Surveys.after.insert(function(userId, doc){
        generateReport(userId, doc);
        addToFeeds(userId, doc);
    });
}