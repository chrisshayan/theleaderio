/**
 * Created by HungNguyen on 8/16/15.
 */

Template.feeds.onCreated(function () {
    var instance = Template.instance();
    //instance.props = new ReactiveDict();
    instance.subs = [];
    this.user = Meteor.user();
    instance.autorun(function () {
        var sub = instance.subscribe('posts');
        instance.subs.push(sub);
    });
});


Template.feeds.onRendered(function () {

});


Template.feeds.onDestroyed(function () {
    _.each(Template.instance().subs, function (sub) {
        sub.stop();
    });
});

Template.feeds.helpers({
    'feeds': function () {
        return [];
    },
    posts: function () {
        var query = {};
        var options = {limit: 10, skip: 0, sort: {date: -1}};

        return Meteor.posts.find(query, options);
    },
    hasLeader: function () {
        return Meteor.user().leader();
    }

});


Template.feeds.events({
    'submit #feedback': function (e) {
        e.preventDefault();
        var user = Meteor.user();
        console.log('submit');
        var content = e.target.feedContent.value;
        console.log(content);
        var posts = new Post({body: content});

        console.log('poster', posts.poster);
        if (user.leader())
            posts.userId = user.leader()._id;

        posts.save();

        e.target.feedContent.value = '';
    }
});


//Template feedItem

Template.feedItem.onCreated(function () {

});


Template.feedItem.onRendered(function () {

});


Template.feedItem.onDestroyed(function () {

});

Template.feedItem.helpers({});


Template.feedItem.events({});