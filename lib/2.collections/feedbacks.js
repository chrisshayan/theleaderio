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
	console.log(doc);
})