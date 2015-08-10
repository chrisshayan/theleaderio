Schemas.Employee = new SimpleSchema({
    name: {
        type: String,
        index: 1    
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email
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
