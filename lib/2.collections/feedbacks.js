Collections.Feedbacks = new Mongo.Collection("feedbacks");
Collections.Feedbacks.attachSchema(Schemas.Feedback);

var allowAll = function(userId, doc) {
    return Roles.userIsInRole(userId, [ROLE.EMPLOYEE]);
};

Collections.Feedbacks.allow({
    insert: allowAll
});

Collections.Feedbacks.before.insert(function(userId, doc) {
	doc.leaderId = Meteor.user().leader()._id;
	doc.createdAt = new Date();
	doc.createdBy = userId;
});

if(Meteor.isServer) {
    function addToFeeds(userId, doc) {
        Meteor.defer(function() {
            var feed = new Feed();
            feed.type = 1;
            feed.createdBy = userId;
            feed.createdAt = new Date();
            feed.followers = [userId, doc.leaderId];
            feed.data = {
                typeId: doc._id,
                isAnonymous: doc.isAnonymous,
                leaderId: doc.leaderId,
                content: doc.content
            };
            feed.save();
        });
    }

    Collections.Feedbacks.after.insert(function(userId, doc) {
        addToFeeds(userId, doc);
    });
}