Template.feedbackCounter.onCreated(function() {
    var instance = Template.instance();
    instance.feedback = new ReactiveVar({});
    Meteor.call('feedbackCounter', function(err, data) {
        if(err) throw err;
        instance.feedback.set(data);
    });
});

Template.feedbackCounter.helpers({
    positive: function() {
        var data = Template.instance().feedback.get();
        return data.positive || 0;
    },

    negative: function() {
        var data = Template.instance().feedback.get();
        return data.negative || 0;
    },

    positivePercent: function() {
        var data = Template.instance().feedback.get();
        return data.positivePercent || 0;
    },

    negativePercent: function() {
        var data = Template.instance().feedback.get();
        return data.negativePercent || 0;
    }
});