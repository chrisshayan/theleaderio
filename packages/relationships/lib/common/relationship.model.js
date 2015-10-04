Relationship = BaseModel.extendAndSetupCollection("relationships");

Relationship.appendSchema({
    type: {
        type: Number,
        // 1: leader-employee, 2: leader-leader
    },
    userId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        //  if type = 1, userId is id of leader
    },
    elseId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    createdAt: {
        type: Date
    }
});