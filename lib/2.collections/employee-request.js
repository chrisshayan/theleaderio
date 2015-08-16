SimpleSchema.messages({
    employeeExists: "This employee's email existing"
})
Schemas.EmployeeRequests = new SimpleSchema({
    firstName: {
        type: String,
        autoform: {
            label: false,
            placeholder: "First name (required)"
        }
    },
    lastName: {
        type: String,
        optional: true,
        autoform: {
            label: false,
            placeholder: "Last name"
        }
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        custom: function() {
            var isExists = Collections.EmployeeRequests.find({email: this.value, createdBy: Meteor.userId()}).count();
            if(isExists) {
                return "employeeExists";
            }           
        },
        autoform: {
            label: false,
            placeholder: "Email (required)"
        }
    },
    status: {
    	type: Number,
   		defaultValue: 1, // 1: new , 2: invited, 3: connected
   		autoform: {
            omit: true
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
        optional: true,
        autoform: {
            omit: true
        }
    }
});



Collections.EmployeeRequests = new Mongo.Collection("employee_requests");
Collections.EmployeeRequests.attachSchema(Schemas.EmployeeRequests);

var checkPermission = function(userId, doc) {
    if(!userId) return false;
    return Roles.userIsInRole(userId, [ROLE.LEADER]);
};

Collections.EmployeeRequests.allow({
    insert: checkPermission,
    update: checkPermission,
    remove: checkPermission
});

Collections.EmployeeRequests.before.insert(function(userId, doc) {
    doc.createdBy = userId;
    doc.createdAt = new Date();
});
