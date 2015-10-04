//Meteor.publishComposite('employeeDashboard', function () {
//    if (!this.userId) return [];
//    var currentUser = Meteor.users.findOne({_id: this.userId});
//    if (!currentUser || !currentUser.isEmployee()) return [];
//    return {
//        find: function () {
//            return Meteor.relationships.find({type: 1, elseId: this.userId});
//        },
//        children: [
//            {
//                find: function (relationship) {
//                    var opt = {
//                        fields: {
//                            _id: 1,
//                            profile: 1
//                        }
//                    }
//                    return Meteor.users.find({_id: relationship.userId}, opt);
//                }
//            }
//        ]
//    }
//});

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
                    if (post.picture)
                        return Collections.Images.find({_id: post.picture});
                    return null;
                }
            }
        ]
    };
});

Meteor.publishComposite("employeeDashboard", function () {
    // return leader, user, profile, image
    return {
        find: function () {
            var filter = {
                type: 1,
                elseId: this.userId
            };
            return Meteor.relationships.find(filter, {limit: 1});
        },
        children: [
            {
                // return users
                find: function (r) {
                    var option = {
                        limit: 1,
                        fields: {
                            emails: 1
                        }
                    };
                    return Meteor.users.find({_id: r.userId}, {limit: 1});
                },
                children: [{
                    // return profiles
                    find: function (user) {
                        return Meteor.profiles.find({userId: user._id});
                    },
                    // return images
                    children: [
                        {
                            find: function (profile) {
                                if (!profile.picture) return null;
                                return Meteor.images.find({_id: profile.picture});
                            }
                        }
                    ]

                }]
            }
        ]
    };
});

Meteor.publish('reports', function (filter, option) {
    if (!this.userId) return null;
    var leaderId = filter.leaderId;
    if (leaderId === this.userId) {
        var user = Meteor.users.findOne({_id: this.userId});
        if (!user.isLeader()) return null;
    } else {
        var isRelated = Meteor.relationships.find({type: 1, userId: leaderId, elseId: this.userId}).count();
        if(!isRelated) return null;
    }
    return Collections.SurveyStatistics.find(filter, option);
});