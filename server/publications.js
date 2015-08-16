Meteor.publishComposite('employeeDashboard', function() {
    if(!this.userId) return [];
    var currentUser = Meteor.users.findOne({_id: this.userId});
    if(!currentUser || !currentUser.isEmployee()) return [];
    return {
        find: function(){
            return Collections.Relationships.find({type: 1, elseId: this.userId});
        },
        children: [
            {
                find: function(relationship){
                    var opt = {
                        fields: {
                            _id: 1,
                            profile: 1
                        }
                    }
                    return Meteor.users.find({_id: relationship.userId}, opt);
                }
            }
        ]
    }
});

Meteor.publish("industries", function() {
    return Collections.Industries.find();
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
        if (this.userId) {
            leaderId = this.userId;
        } else {
            return new Meteor.Error(403, "You don't have permission to access this page");
        }
    }

    limit += base;
    return Collections.Feedbacks.find({type: type, leaderId: leaderId}, {sort: {createdAt: -1}, limit: limit});
});