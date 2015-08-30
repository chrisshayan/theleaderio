Meteor.publishComposite('employeeDashboard', function () {
    if (!this.userId) return [];
    var currentUser = Meteor.users.findOne({_id: this.userId});
    if (!currentUser || !currentUser.isEmployee()) return [];
    return {
        find: function () {
            return Collections.Relationships.find({type: 1, elseId: this.userId});
        },
        children: [
            {
                find: function (relationship) {
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

Meteor.publish("industries", function () {
    return Collections.Industries.find();
});

Meteor.publishComposite("employeeFeedbacks", function (leaderId, limit) {
    return {
        find: function () {
            check(leaderId, String);
            check(limit, Number);
            var base = 10;
            limit += base;
            return Collections.Feedbacks.find({leaderId: leaderId, createdBy: this.userId}, {
                sort: {createdAt: -1}, limit: limit
            });
        }
    };
});

Meteor.publishComposite("feedbacks", function (leaderId, limit) {
    return {
        find: function () {
            check(leaderId, String);
            check(limit, Number);
            var base = 10;
            limit += base;
            return Collections.Feedbacks.find({leaderId: leaderId}, {
                sort: {createdAt: -1}, limit: limit
            });
        },
        children: [
            {
                find: function (feedback) {
                    if (feedback.isAnonymous) return null;
                    return Meteor.users.find({_id: feedback.createdBy});
                }
            }
        ]
    };
});

Meteor.publishComposite("postDetails", function (_id) {
    return {
        find: function () {
            check(_id, String);
            return Collections.Posts.find({_id: _id});
        },
        children: [
            {
                find: function (post) {
                    if(post.picture)
                        return Collections.Images.find({_id: post.picture});
                    return null;
                }
            }
        ]
    };
});

Meteor.publishComposite("explore", function () {
    return {
        find: function () {
            return Collections.Posts.find({
                createdBy: this.userId
            }, {
                sort: {
                    createdAt: -1
                }
            });
        },
        children: [
            {
                find: function (post) {
                    if(post.picture)
                        return Collections.Images.find({_id: post.picture});
                    return null;
                }
            }
        ]
    };
});