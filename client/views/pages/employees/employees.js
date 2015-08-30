Template.employees.events({
    'click .send-access-links': function () {
        Meteor.call('sendEmployeeInvitations', function (err, result) {
            if (err) {
                analytics.track('Send Invitation Failed', {
                    category: 'Leader:' + Meteor.userId(),
                    label: 'Employee:All'
                });
                throw err;
            }
            if (result) {
                toastr.success("success", "Send invitation");
                analytics.track('Send All Invitation Success', {
                    category: 'Leader:' + Meteor.userId(),
                    label: 'Employee:All'
                });
            }
        });
        swal("Sent!", "We sent invitations to employees", "success")
    }
});


Template.employeeRequestActions.events({
    'click .send-invite': function (e) {
        e.preventDefault();
        var self = this;

        Meteor.call('sendEmployeeInvitations', [this._id], function (err, result) {
            if (err) {
                analytics.track('Send Invitation Failed', {
                    category: 'Leader:' + Meteor.userId(),
                    label: 'Employee:' + self._id
                });
                throw err;
            }
            if (result) {
                toastr.success("success", "Send invitation");
                analytics.track('Send Invitation Success', {
                    category: 'Leader:' + Meteor.userId(),
                    label: 'Employee:' + self._id
                });
            }
        });
    }
});
Template.employeeRequestActions.helpers({
    isStatus: function (status) {
        return this.status === status;
    }
});