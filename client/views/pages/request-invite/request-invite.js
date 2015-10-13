Template.adminRequestActions.events({
    'click .send-invite': function (e) {
        e.preventDefault();
        Meteor.call('sendLeaderInvitation', this._id, function (err, result) {
            if (err) throw err;
            if (result) {
                toastr.success("success", "Send invitation");

                analytics.track('admin action', {
                    eventName: 'add employee'
                })
            }
        });
    },

    'click .generate-link': function(e) {
        e.preventDefault();
        Meteor.call('generateLinkInvitation', this._id, function(err, link) {
            if(err) throw err;
            prompt('Please copy invitation link', link);
        });
    }
});
Template.adminRequestActions.helpers({
    isStatus: function (status) {
        return this.status === status;
    }
});