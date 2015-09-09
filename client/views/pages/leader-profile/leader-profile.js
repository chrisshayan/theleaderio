function pointRange(start, end) {
    var result = [];
    if (end < start) return result;

    var length = end - start + 1;
    while (length) {
        result.push(start);
        start++;
        length--;
    }
    return result;
}

var START = 1;
var END = 5;

var QUESTIONS = [
    {
        index: 0,
        title: 'Goals and Purpose',
        question: 'Does Leader set goals generally?',
        type: 'goalRating',
        slideClass: 'slide--current',
        questionIcon: 'flaticon-goal5'
    },
    {
        index: 1,
        title: 'Meetings',
        question: 'Does Leader handle/define meetings properly?',
        type: 'meetingRating',
        slideClass: '',
        questionIcon: 'flaticon-businessman'
    },
    {
        index: 2,
        title: 'Ground rules and norms',
        question: 'Does Leader set Ground rules and norms?',
        type: 'groundRulesRating',
        slideClass: '',
        questionIcon: 'flaticon-rule3'
    },
    {
        index: 3,
        title: 'Communication',
        question: 'Does Leader communicate properly?',
        type: 'communicationRating',
        slideClass: '',
        questionIcon: 'flaticon-two210'
    },
    {
        index: 4,
        title: 'Leadership',
        question: 'Does Leader lead properly?',
        type: 'leadershipRating',
        slideClass: '',
        questionIcon: 'flaticon-tie13'
    },
    {
        index: 5,
        title: 'Workload/ Distribution of work',
        question: 'Does Leader help on workload and fair distribution of work?',
        type: 'workloadRating',
        slideClass: '',
        questionIcon: 'flaticon-working2'
    },
    {
        index: 6,
        title: 'Energy/Commitment Level',
        question: 'Does Leader committed to work and is he passionate about it?',
        type: 'energyRating',
        slideClass: '',
        questionIcon: 'flaticon-energy28'
    },
    {
        index: 7,
        title: 'Management of Stress',
        question: 'Is Leader handling the stress as a facade?',
        type: 'stressRating',
        slideClass: '',
        questionIcon: 'flaticon-women47'
    },
    {
        index: 8,
        title: 'Decision Making',
        question: 'Is Leader able to make decision in a fair way?',
        type: 'decisionRating',
        slideClass: '',
        questionIcon: 'flaticon-hammers4'
    },
    {
        index: 9,
        title: 'Respect for differences/diversity',
        question: 'Does he respect to differences and diversity?',
        type: 'respectRating',
        slideClass: '',
        questionIcon: 'flaticon-job16'
    },
    {
        index: 10,
        title: 'Management of conflict',
        question: 'Does Leader handle the conflicts properly?',
        type: 'conflictRating',
        slideClass: '',
        questionIcon: 'flaticon-puzzle-piece1'
    }

];

AutoForm.hooks({
    sendFeedbackForm: {
        onSuccess: function () {
            //AutoForm.resetForm("sendFeedbackForm")
            Router.go('dashboard');
            toastr.success("Send feedback successful");

            analytics.track('Send Feedback', {
                category: 'Employee:' + Meteor.userId(),
                label: 'Leader:' + Meteor.user().leader()._id
            });
        }
    },
    takeSurveyForm: {
        onError: function (a, b, c) {
            console.log(a, b, c);
        },
        onSuccess: function () {
            Router.go('dashboard');
            toastr.success("Send survey successful");


            analytics.track('Do Survey', {
                category: 'Employee:' + Meteor.userId(),
                label: 'Leader:' + Meteor.user().leader()._id
            });

        }
    }
});

Template.leaderProfile.onCreated(function () {
    var instance = Template.instance();
    instance.isLoading = new ReactiveVar(true);
    instance.action = new ReactiveVar("");

    instance.autorun(function () {
        instance.sub = Meteor.subscribe("employeeDashboard", {
            onReady: function () {
                instance.isLoading.set(false);
            }
        });

        var params = Router.current().params;
        if (params.query.hasOwnProperty("action")) {
            var action = params.query.action.toLowerCase();
            instance.action.set(action);
        } else {
            $(".modal").remove();
            $('.modal-backdrop').remove();
            instance.action.set("");
        }
    });
});

Template.leaderProfile.onDestroyed(function () {
    var instance = Template.instance();
    instance.sub.stop();
});


Template.leaderProfile.rendered = function () {

    // Set options for peity charts
    $(".line").peity("line", {
        fill: '#1ab394',
        stroke: '#169c81'
    })

    $(".bar").peity("bar", {
        fill: ["#1ab394", "#d7d7d7"]
    })

};

Template.leaderProfile.helpers({
    isLoading: function () {
        return Template.instance().isLoading.get();
    },
    leader: function () {
        return Meteor.user().leader();
    },

    isAction: function (action) {
        return Template.instance().action.get() == action;
    }
});


Template.sendFeedbackModal.onRendered(function () {
    $("#sendFeedbackModal").modal("show");
    $("#sendFeedbackModal").on('hidden.bs.modal', function () {
        $(this).data('bs.modal', null);
    });
});

Template.surveySlider.onCreated(function () {
    //this.questions = questions;
});

Template.surveySlider.helpers({
    questions: function () {
        return QUESTIONS;
    }
});

Template.surveySlider.events({});

Template.takeSurveyModal.onRendered(function () {
    $("#takeSurveyModal").modal("show");

    $('input').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green'
    });
});

Template.ratingSurveys.helpers({
    range: function () {
        return pointRange(START, END);
    }
});

Template.ratingSurveys.events({
    'ifChecked input': function () {
        $('.button--nav-next .fa-arrow-right').trigger('click');
    }
});





