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
            options: ratingOptions,
            class: "i-checks",
            label: false
        }
    },
    meetingRating: {
        type: Number,
        label: "Meetings",
        min: 1,
        max: 5,
        autoform: {
            type: "select-radio-inline",
            options: ratingOptions,
            class: "i-checks",
            label: false
        }
    },
    groundRulesRating: {
        type: Number,
        label: "Ground Rules and Norms",
        min: 1,
        max: 5,
        autoform: {
            type: "select-radio-inline",
            options: ratingOptions,
            class: "i-checks",
            label: false
        }
    },
    communicationRating: {
        type: Number,
        label: "Communication",
        min: 1,
        max: 5,
        autoform: {
            type: "select-radio-inline",
            options: ratingOptions,
            class: "i-checks",
            label: false
        }
    },
    leadershipRating: {
        type: Number,
        label: "Leadership",
        min: 1,
        max: 5,
        autoform: {
            type: "select-radio-inline",
            options: ratingOptions,
            class: "i-checks",
            label: false
        }
    },
    workloadRating: {
        type: Number,
        label: "Workload/ Distribution of work",
        min: 1,
        max: 5,
        autoform: {
            type: "select-radio-inline",
            options: ratingOptions,
            class: "i-checks",
            label: false
        }
    },
    energyRating: {
        type: Number,
        label: "Energy/Commitment Level",
        min: 1,
        max: 5,
        autoform: {
            type: "select-radio-inline",
            options: ratingOptions,
            class: "i-checks",
            label: false
        }
    },
    stressRating: {
        type: Number,
        label: "Management of Stress",
        min: 1,
        max: 5,
        autoform: {
            type: "select-radio-inline",
            options: ratingOptions,
            class: "i-checks",
            label: false
        }
    },
    decisionRating: {
        type: Number,
        label: "Decision Making",
        min: 1,
        max: 5,
        autoform: {
            type: "select-radio-inline",
            options: ratingOptions,
            class: "i-checks",
            label: false
        }
    },
    respectRating: {
        type: Number,
        label: "Respect for differences/diversity",
        min: 1,
        max: 5,
        autoform: {
            type: "select-radio-inline",
            options: ratingOptions,
            class: "i-checks",
            label: false
        }
    },
    conflictRating: {
        type: Number,
        label: "Management of conflict",
        min: 1,
        max: 5,
        autoform: {
            type: "select-radio-inline",
            options: ratingOptions,
            class: "i-checks",
            label: false
        }
    },
    overall: {
        type: Number,
        decimal:true,
        autoform: {
            omit: true
        }
    },
    createdBy: {
        type: String,
        optional: true
    },
    createdAt: {
        type: Date
    },
    leaderId: {
        type: String
    }
});
