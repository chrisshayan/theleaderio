
EmployeesSchema =  new SimpleSchema({
    name: {
        type: String,
        index: 1
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        unique: true
    }
});


var EmployeesCollection = {};

Employees = EmployeesCollection.Employees = new Mongo.Collection("employees");
Employees.attachSchema(EmployeesSchema);

var allowAll = function () {
    return true;
};

Employees.allow({
    insert: allowAll,
    remove: allowAll
});
