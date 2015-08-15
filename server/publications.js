Meteor.publish('employeeDetails', function (_id) {
    check(_id, String);
    if (!this.userId) return new Meteor.Error(403, 'User not login');
    return Collections.Employees.find({_id: _id}, {limit: 1});
});

Meteor.publish("feedbacks", function (token, type, limit) {
    if (token) {
        check(token, Match.Any);
        check(type, String);
        check(limit, Number);
        var checkToken = IZToken.verify(token);
        if (!checkToken.success)
            return new Meteor.Error(403, "You don't have permission to access this page");
        var employee = IZToken.getData(token);
        leaderId = employee.createdBy;
    }
    else {
        if (!this.userId) return false;
        var base = 5;
        var leaderId = null;
        console.log('a', this.userId);
        if (this.userId) {
            leaderId = this.userId;
        } else {
            return new Meteor.Error(403, "You don't have permission to access this page");
        }
    }

    limit += base;
    return Collections.Feedbacks.find({type: type, leaderId: leaderId}, {sort: {createdAt: -1}, limit: limit});
});