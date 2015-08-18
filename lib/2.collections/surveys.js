Collections.Surveys = new Mongo.Collection("surveys");
Collections.Surveys.attachSchema(Schemas.Survey);

var allowEmployee = function(userId, doc) {
    return Roles.userIsInRole(userId, [ROLE.EMPLOYEE]);
}
Collections.Surveys.allow({
	insert: allowEmployee
});

Collections.Surveys.before.insert(function(userId, doc){
	doc.createdAt = new Date();
	doc.createdBy = userId;
    var relation = Collections.Relationships.findOne({type: 1, elseId: userId});
    if(!relation) return null;
    doc.leaderId = relation.userId;
});