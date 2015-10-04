Meteor.publishComposite('userProfile', function () {
    if (!this.userId) return null;
    var self = this;
    return {
        find: function () {
            return Meteor.profiles.find({userId: self.userId}, {limit: 1});
        },
        children: [
            {
                find: function (profile) {
                    if (!profile.picture) return null;
                    return Meteor.images.find({_id: profile.picture});
                }
            }
        ]
    };
});

Meteor.publishComposite('avatar', function (userId) {
    if (!this.userId || !userId) return null;
    return {
        find: function () {
            return Meteor.profiles.find({userId: userId}, {limit: 1, fields: {userId: 1, firstName: 1, picture: 1}});
        },
        children: [
            {
                find: function (profile) {
                    if (!profile.picture) return null;
                    return Meteor.images.find({_id: profile.picture});
                }
            }
        ]
    };
});