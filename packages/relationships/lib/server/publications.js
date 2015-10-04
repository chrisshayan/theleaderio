Meteor.publishComposite('employees', function (option) {
    var self = this;
    if (!this.userId) return null;
    if (!option) option = {};
    var user = Meteor.users.findOne({_id: this.userId});
    if (!user.isLeader()) return null;
    //console.log()
    return {
        find: function () {
            option = _.pick(option, 'limit', 'sort', 'fields');
            if(!option.limit) option.limit = 10;
            option.limit += 1;
            return Meteor.relationships.find({type: 1, userId: self.userId}, option);
        },
        children: [
            {
                // return users
                find: function (relationship) {
                    var option = {
                        limit: 1,
                        fields: {
                            emails: 1
                        }
                    };
                    return Meteor.users.find({_id: relationship.elseId}, option);
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
    }
});

Meteor.publishComposite('friends', function (option) {
    var self = this;
    if (!this.userId) return null;
    if (!option) option = {};
    var user = Meteor.users.findOne({_id: this.userId});
    if (!user.isLeader()) return null;
    return {
        find: function () {
            var filter = {
                type: 2,
                $or: [{userId: self.userId}, {elseId: self.userId}]
            };
            option = _.pick(option, 'limit', 'sort', 'fields');
            if(!option.limit) option.limit = 10;
            option.limit += 1;
            return Meteor.relationships.find(filter, option);
        },
        children: [
            {
                // return users
                find: function (relationship) {
                    var option = {
                        limit: 1,
                        fields: {
                            emails: 1
                        }
                    };
                    if(relationship.userId == user._id) {
                        var userId = relationship.elseId;
                    } else {
                        var userId = relationship.userId;
                    }
                    return Meteor.users.find({_id: userId}, option);
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
    }
});