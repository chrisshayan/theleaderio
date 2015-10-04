Template.topBar.helpers({
    name: function() {
        var profile = Meteor.user() && Meteor.user().getProfile();
        return profile ? [profile.firstName, profile.lastName].join(' ') : '';
    },

    pictureId: function() {
        var profile = Meteor.user() && Meteor.user().getProfile();
        if(!profile) return '';
        return profile.picture;
    },

    pictureAlt: function() {
        var profile = Meteor.user() && Meteor.user().getProfile();
        if(!profile) return '';
        return profile.firstName;
    }
})