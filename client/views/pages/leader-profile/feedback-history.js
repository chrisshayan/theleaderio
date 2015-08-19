Template.feedbackHistory.onCreated(function () {
    var self = this;
    var instance = Template.instance();
    instance.limit = new ReactiveVar(10);
    instance.base = 10;
    instance.autorun(function () {
        var leaderId = Meteor.user().leader()._id;
        if(leaderId) {
            var limit = instance.limit.get();
            self.sub = self.subscribe("feedbacks", leaderId, limit)
        }
    });

    instance.fetch = function() {
        var leaderId = Meteor.user().leader()._id;
        var limit = Template.instance().limit.get();
        return Collections.Feedbacks.find({leaderId: leaderId}, {sort: {createdAt: -1}, limit: limit});
    }

    instance.total = function() {
        var leaderId = Meteor.user().leader()._id;
        return Collections.Feedbacks.find({leaderId: leaderId}).count();
    }
});

Template.feedbackHistory.onDestroyed(function() {
    var instance = Template.instance();
    instance.sub.stop();
});


Template.feedbackHistory.helpers({
    feedbacks: function () {
        return Template.instance().fetch();
    },
    isLoadmore: function() {
        var instance = Template.instance();
        return instance.total() > instance.limit.get();
    }
});

Template.feedbackHistory.events({
    'click .loadmore': function() {
        var instance = Template.instance();
        instance.limit.set(instance.limit.get() + instance.base);
    }
});

Template.feedbackItem.helpers({
   timeago: function() {
       return moment(this.createdAt).fromNow();
   }
});