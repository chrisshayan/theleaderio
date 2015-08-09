Collections.Employees = new Mongo.Collection("employees");
Collections.Employees.attachSchema(Schemas.Employee);

var allowAll = function() {
    return true;
};

var checkPermission = function(userId, doc, fieldNames, modifier) {
    return doc.createdBy === userId;
};

Collections.Employees.allow({
    insert: function(userId) {
    	return !!userId;
    },
    update: checkPermission,
    remove: checkPermission
});

Collections.Employees.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
    doc.createdBy = userId;
});
