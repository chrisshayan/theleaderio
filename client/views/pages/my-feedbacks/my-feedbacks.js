Template.myFeedbacks.onCreated(function () {
    var self = this;
    Session.setDefault('feedbackLoading', true);
    Session.setDefault('feedbackLoadingMore', false);
    Session.setDefault('feedbackLimit', 10);
    Session.setDefault('feedbackSelected', null);
    var instance = Template.instance();
    instance.autorun(function () {
        if (Session.equals('feedbackLoading', false)) {
            Session.set('feedbackLoadingMore', true);
        }
        var sub = self.subscribe('feedbacks', Meteor.userId(), Session.get("feedbackLimit"));
        if (sub.ready()) {
            var feedback = Collections.Feedbacks.findOne({leaderId: Meteor.userId()}, {sort: {createdAt: -1}});
            Session.set("feedbackLoading", false);
            Session.set('feedbackLoadingMore', false);
            Session.set("feedbackSelected", feedback);
        }
    });
});

Template.myFeedbacks.helpers({
    isReady: function () {
        return !Session.get("feedbackLoading");
    },

    noFeedback: function () {
        return Collections.Feedbacks.find({leaderId: Meteor.userId()}).count() <= 0;
    }
});

Template.feedbacks.rendered = function () {

    // Add special class for full height
    $('body').addClass('fixed-sidebar');
    $('body').addClass('full-height-layout');

    // Set the height of the wrapper
    $('#page-wrapper').css("min-height", $(window).height() + "px");

    // Add slimScroll to element
    $('.full-height-scroll').slimscroll({
        height: '100%'
    });

    // Add slimScroll to left navigation
    $('.sidebar-collapse').slimScroll({
        height: '100%',
        railOpacity: 0.9
    });
};

Template.feedbacks.destroyed = function () {

    // Remove special class for full height
    $('body').removeClass('fixed-sidebar');
    $('body').removeClass('full-height-layout');

    // Destroy slimScroll for left navigation
    $('.sidebar-collapse').slimScroll({
        destroy: true
    });

    // Remove inline style form slimScroll
    $('.sidebar-collapse').removeAttr("style");
};

Template.feedbacks.helpers({
    items: function () {
        return Collections.Feedbacks.find({
            leaderId: Meteor.userId()
        }, {
            limit: Session.get('feedbackLimit'),
            sort: {
                createdAt: -1
            }
        });
    },

    hasMore: function () {
        var total = Collections.Feedbacks.find({leaderId: Meteor.userId()}).count();
        return total > Session.get('feedbackLimit');
    },

    isLoadingMore: function () {
        return Session.get('feedbackLoadingMore');
    }
});


Template.feedbacks.events({
    'click .loadmore': function (e) {
        Session.set("feedbackLimit", Session.get("feedbackLimit") + 10);
        e.preventDefault();
    }
});

Template.myFeedbackItem.helpers({
    name: function () {
        if (this.isAnonymous) return "Anonymous";
        var employee = Meteor.users.findOne({_id: this.createdBy});
        if (!employee) return "";
        return employee.profile.lastName + " " + employee.profile.firstName;
    },
    shortContent: function () {
        var words = _.words(this.content);
        return words.splice(0, 20).join(" ");
    },

    showPoint: function () {
        return this.point != 0;
    },

    pointText: function () {
        return (this.point > 0) ? "+" + this.point : this.point;
    },

    pointLabel: function () {
        if (this.point > 0) {
            return " label-primary ";
        } else {
            return " label-danger ";
        }
    },

    timeago: function () {
        return moment(this.createdAt).fromNow();
    },

    activeClass: function () {
        var feedbackSelected = Session.get("feedbackSelected");
        return this._id == feedbackSelected._id ? " active " : "";
    }
});

Template.myFeedbackItem.events({
    'click .list-group-item': function (e) {
        Session.set("feedbackSelected", this);
        e.preventDefault();
    }
});

Template.feedbackContent.helpers({
    content: function () {
        var feedback = Session.get("feedbackSelected");
        return feedback ? feedback.content : "";
    },

    showPoint: function () {
        var feedback = Session.get("feedbackSelected");
        return feedback && feedback.point != 0;
    },

    pointText: function () {
        var feedback = Session.get("feedbackSelected");
        if (!feedback) return "";
        return (feedback.point > 0) ? "+" + feedback.point : feedback.point;
    },

    pointLabel: function () {
        var feedback = Session.get("feedbackSelected");
        if (!feedback) return "";
        if (feedback.point > 0) {
            return " label-primary ";
        } else {
            return " label-danger ";
        }
    },

    timeago: function () {
        var feedback = Session.get("feedbackSelected");
        if (!feedback) return "";
        return moment(feedback.createdAt).fromNow();
    },
    name: function () {
        var feedback = Session.get("feedbackSelected");
        if (!feedback) return "";
        if (feedback.isAnonymous) return "Anonymous";
        var employee = Meteor.users.findOne({_id: feedback.createdBy});
        if (!employee) return "";
        return employee.profile.lastName + " " + employee.profile.firstName;
    },
});