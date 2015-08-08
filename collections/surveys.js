Surveys = new Mongo.Collection("surveys");

Surveys.attachSchema(
    new SimpleSchema({
        goalRating: {
            type: Number,
            label: "Goals and Purpose",
            min: 1,
            max: 5
        },
        meetingRating: {
            type: Number,
            label: "Meetings",
            min: 1,
            max: 5
        },
        groundRulesRating: {
            type: Number,
            label: "Ground Rules and Norms",
            min: 1,
            max: 5
        },
        communicationRating: {
            type: Number,
            label: "Communication",
            min: 1,
            max: 5
        },
        leadershipRating: {
            type: Number,
            label: "Leadership",
            min: 1,
            max: 5
        },
        workloadRating: {
            type: Number,
            label: "Workload/ Distribution of work",
            min: 1,
            max: 5
        },
        energyRating: {
            type: Number,
            label: "Energy/Commitment Level",
            min: 1,
            max: 5
        },
        stressRating: {
            type: Number,
            label: "Management of Stress",
            min: 1,
            max: 5
        },
        decisionRating: {
            type: Number,
            label: "Decision Making",
            min: 1,
            max: 5
        },
        respectRating: {
            type: Number,
            label: "Respect for differences/diversity",
            min: 1,
            max: 5
        },
        conflictRating: {
            type: Number,
            label: "Management of conflict",
            min: 1,
            max: 5
        },
        userId: {
            type: String,
            label: "User Id",
            autoValue: function () {
                if (this.isInsert) {
                    return getUserName(Meteor.user());
                } else if (this.isUpsert) {
                    return {
                        $setOnInsert: getUserName(Meteor.user())
                    };
                } else {
                    this.unset();
                }
            }
        },
        biggestChallengeIFace: {
            type: String,
            label: "The biggest challenge I face as a team member",
            max: 200000,
            optional: true
        },
        teamToDo: {
            type: String,
            label: "The one thing I would most like to see the team do i",
            max: 200000,
            optional: true
        },
        leaderToDo: {
            type: String,
            label: "The one thing I would most like to see the Leader do",
            max: 200000,
            optional: true
        },
        employee: {
          type: EmployeesSchema
        },
        createdAt: {
            type: Date,
            autoValue: function () {
                if (this.isInsert) {
                    return new Date();
                } else if (this.isUpsert) {
                    return {
                        $setOnInsert: new Date()
                    };
                } else {
                    this.unset();
                }
            },
            denyUpdate: true
        },
        updatedAt: {
            type: Date,
            autoValue: function() {
                if (this.isUpdate) {
                    return new Date();
                }
            },
            denyInsert: true,
            optional: true
        }
    })
);
