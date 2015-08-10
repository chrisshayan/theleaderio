Collections.Surveys = new Mongo.Collection("surveys");
Collections.Surveys.attachSchema(Schemas.Survey);
Collections.Surveys.allow({
	insert: function(userId, doc) {
		console.log(doc)
		return true;
	}
});

Collections.Surveys.before.insert(function(userId, doc){
	doc.createdAt = new Date();
})

Collections.Surveys.before.update(function(userId, doc){
	doc.updatedAt = new Date();
})
