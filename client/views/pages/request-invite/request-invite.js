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
    }
});
Template.adminRequestActions.helpers({
    isStatus: function (status) {
        return this.status === status;
    }
});