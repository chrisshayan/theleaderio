var apis = {};

/**
 * Count my employees
 */
apis.employeeCount = function () {
    if (!this.userId) return 0;
    return Meteor.relationships.find({type: 1, userId: this.userId}).count()
};

apis.hasFriend = function () {
    if(!this.userId) return false;
    var result = !!Meteor.relationships.find({type: 2, $or: [{userId: this.userId}, {elseId: this.userId}]}).count();
    result &= !!Collections.LeaderRequests.find({createdBy: this.userId}).count();
    return result;
};

Meteor.methods(apis);