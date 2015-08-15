Collections.Feedbacks = new Mongo.Collection("feedbacks");
Collections.Feedbacks.attachSchema(Schemas.Feedback);

var allowAll = function() {
    return true;
};

Collections.Feedbacks.allow({
    insert: allowAll
});
