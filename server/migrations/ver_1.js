Migrations.add({
    version: 1,
    name: 'Move profile from users to profiles',
    up: function () {
        Meteor.users.find({'profile.firstName': {$exists: true}}).forEach(function (user) {
            if (!Meteor.profiles.find({userId: user._id}).count()) {
                var profile = new Profile({
                    userId: user._id,
                    firstName: user.profile.firstName || '',
                    lastName: user.profile.lastName || '',
                    industries: user.profile.industries || [],
                    picture: '',
                    headline: '',
                    bio: ''
                }).save();

                Meteor.users.update({_id: user._id}, {$set: { profile: {} }});
            }
        });
    },
    down: function () {

    }
})