Migrations.add({
    version: 2,
    name: 'Convert point to number',
    up: function () {
        Collections.Surveys.find().forEach(function(s) {
            Collections.Surveys.update({_id: s._id}, {$set: {
                goalRating: +s.goalRating,
                meetingRating: +s.meetingRating,
                groundRulesRating: +s.groundRulesRating,
                communicationRating: +s.communicationRating,
                leadershipRating: +s.leadershipRating,
                workloadRating: +s.workloadRating,
                energyRating: +s.energyRating,
                stressRating: +s.stressRating,
                decisionRating: +s.decisionRating,
                respectRating: +s.respectRating,
                conflictRating: +s.conflictRating,
                overall: +s.overall
            }});
        });
    },
    down: function () {

    }
})