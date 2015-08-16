Schemas.Feedback = new SimpleSchema({
    point: {
        type: Number,
        defaultValue: 0,
        autoform: {
            type: "select",
            options: function() {
                var data = [];
                _.each([5,4,3,2,1,0,-1,-2,-3,-4,-5], function(i) {
                    data.push({
                        label: i,
                        value: i
                    })
                });
                return data;
            }
        }
    },
    content: {
        type: String,
        autoform: {
            type: "textarea",
            label: false,
            placeholder: "Your message..."
        }
    },
    leaderId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
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
        autoform: {
            omit: true
        }
    }
});
