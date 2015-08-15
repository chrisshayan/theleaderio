Schemas.Feedback = new SimpleSchema({
    type: {
        type: String,
        allowedValues: ["positive", "negative", "neutral"]
    },
    content: {
        type: String
    },
    leaderId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    createdAt: {
        type: Date
    }
});
