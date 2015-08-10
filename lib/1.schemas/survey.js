var ratingOptions = function() {
    return _.map(_.range(1, 6), function(opt) {
        return {
            label: opt,
            value: opt
        }
    });
}
Schemas.Survey = new SimpleSchema({
    goalRating: {
        type: Number,
        label: "Goals and Purpose",
        min: 1,
        max: 5,
        autoform: {
            type: "select-radio-inline",
            value: 1,
            options: ratingOptions
        }
    },
    meetingRating: {
        type: Number,
        label: "Meetings",
        min: 1,
        max: 5,
        autoform: {
            type: "select-radio-inline",
            value: 1,
            options: ratingOptions
        }
    },
    groundRulesRating: {
        type: Number,
        label: "Ground Rules and Norms",
        min: 1,
        max: 5,
        autoform: {
            type: "select-radio-inline",
            value: 1,
            options: ratingOptions
        }
    },
    communicationRating: {
        type: Number,
        label: "Communication",
        min: 1,
        max: 5,
        autoform: {
            type: "select-radio-inline",
            value: 1,
            options: ratingOptions
        }
    },
    leadershipRating: {
        type: Number,
        label: "Leadership",
        min: 1,
        max: 5,
        autoform: {
            type: "select-radio-inline",
            value: 1,
            options: ratingOptions
        }
    },
    workloadRating: {
        type: Number,
        label: "Workload/ Distribution of work",
        min: 1,
        max: 5,
        autoform: {
            type: "select-radio-inline",
            value: 1,
            options: ratingOptions
        }
    },
    energyRating: {
        type: Number,
        label: "Energy/Commitment Level",
        min: 1,
        max: 5,
        autoform: {
            type: "select-radio-inline",
            value: 1,
            options: ratingOptions
        }
    },
    stressRating: {
        type: Number,
        label: "Management of Stress",
        min: 1,
        max: 5,
        autoform: {
            type: "select-radio-inline",
            value: 1,
            options: ratingOptions
        }
    },
    decisionRating: {
        type: Number,
        label: "Decision Making",
        min: 1,
        max: 5,
        autoform: {
            type: "select-radio-inline",
            value: 1,
            options: ratingOptions
        }
    },
    respectRating: {
        type: Number,
        label: "Respect for differences/diversity",
        min: 1,
        max: 5,
        autoform: {
            type: "select-radio-inline",
            value: 1,
            options: ratingOptions
        }
    },
    conflictRating: {
        type: Number,
        label: "Management of conflict",
        min: 1,
        max: 5,
        autoform: {
            type: "select-radio-inline",
            value: 1,
            options: ratingOptions
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
    userId: {
        type: String,
        label: "User Id",
        optional: true,
        autoValue: function() {
            if (this.isInsert) {
                return getUserName(Meteor.user());
            } else if (this.isUpsert) {
                return {
                    $setOnInsert: getUserName(Meteor.user())
                };
            } else {
                this.unset();
            }
        },
        autoform: {
            omit: true
        }
    },
    employee: {
        type: Schemas.Employee,
        optional: true,
        autoform: {
            omit: true
        }
    },
    createdAt: {
        type: Date,
        autoValue: function() {
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
        denyUpdate: true,
        autoform: {
            omit: true
        }
    },
    updatedAt: {
        type: Date,
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }
        },
        denyInsert: true,
        optional: true,
        autoform: {
            omit: true
        }
    }
});
