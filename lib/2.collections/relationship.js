Schemas.Relationship = new SimpleSchema({
    type: {
        type: Number,
        // 1: leader-employee, 2: friend, ...
    },
    userId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        //  if type = 1, userId is id of leader
    },
    elseId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    createdAt: {
        type: Date
    }
});



Collections.Relationships = new Mongo.Collection("relationships");
Collections.Relationships.attachSchema(Schemas.Relationship);

var checkPermission = function(userId, doc) {
    return true;
};

Collections.Relationships.allow({
    insert: checkPermission,
    update: checkPermission,
    remove: checkPermission
});

Collections.Relationships.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
});
