Collections.Employees = new Mongo.Collection("employees");
Collections.Employees.attachSchema(Schemas.Employee);

var allowAll = function() {
    return true;
};

var checkPermission = function(userId, doc, fieldNames, modifier) {
    return doc.createdBy === userId;
};

Collections.Employees.allow({
    insert: function(userId, doc) {
    	return !!userId && Collections.Employees.find({createdBy: userId, email: doc.email}, {limit: 1}).count() === 0;
    },
    update: checkPermission,
    remove: checkPermission
});

Collections.Employees.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
    doc.createdBy = userId;
});
