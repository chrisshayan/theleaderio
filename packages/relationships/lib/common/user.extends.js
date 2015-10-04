User.prototype.employees = function (option) {
    if (!option) option = {};
    if (!option.limit) option.limit = 10;
    var employees = [];
    Meteor.relationships.find({type: 1, userId: Meteor.userId()}, option).forEach(function (r) {
        var user = Meteor.users.findOne({_id: r.elseId});
        user && employees.push(user)
    });

    return employees;
}

User.prototype.friends = function (option) {
    if (!option) option = {};
    if (!option.limit) option.limit = 10;
    var userId = Meteor.userId();
    var filter = {
        type: 2,
        $or: [
            {userId: userId},
            {elseId: userId}
        ]
    };
    var friends = [];
    Meteor.relationships.find(filter, option).forEach(function (r) {
        if (r.userId == userId) {
            var user = Meteor.users.findOne({_id: r.elseId});
        } else {
            var user = Meteor.users.findOne({_id: r.userId});
        }
        user && friends.push(user)
    });


    return friends;
}

