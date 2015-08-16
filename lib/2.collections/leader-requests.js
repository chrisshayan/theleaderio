Schemas.LeaderRequests = new SimpleSchema({
    firstName: {
        type: String,
        autoform: {
            label: false,
            placeholder: "First name"
        }
    },
    lastName: {
        type: String,
        autoform: {
            label: false,
            placeholder: "Last name"
        }
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        unique: true,
        autoform: {
            label: false,
            placeholder: "Email"
        }
    },
    status: {
    	type: Number,
   		defaultValue: 1, // 1: new , 2: invited, 3: connected,
   		autoform: {
            omit: true
        }
    },
    createdAt: {
        type: Date,
        autoform: {
            omit: true
        }
    }
});



Collections.LeaderRequests = new Mongo.Collection("leader_requests");
Collections.LeaderRequests.attachSchema(Schemas.LeaderRequests);

var checkPermission = function(userId, doc) {
    return Roles.userIsInRole(userId, [ROLE.ADMIN]);
};

Collections.LeaderRequests.allow({
    insert: checkPermission,
    update: checkPermission,
    remove: checkPermission
});

Collections.LeaderRequests.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
});
