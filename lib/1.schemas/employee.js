Schemas.Employee = new SimpleSchema({
    name: {
        type: String,
        index: 1
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        unique: true,
        custom: function() {
            if (Meteor.isClient && this.isSet) {
                Meteor.call("checkEmployeeExists", this.value, function(error, result) {
                    if (!result) {
                        Schemas.Employee.namedContext("employeeForm").addInvalidKeys([{
                            name: "email",
                            type: "notUnique"
                        }]);
                    }
                });
            }
        }
    },
    createdAt: {
        type: Date,
        autoform: {
            omit: true
        }
    },
    createdBy: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        autoform: {
            omit: true
        }
    }
});
