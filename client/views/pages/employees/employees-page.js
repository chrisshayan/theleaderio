Template.EmployeesPage.onCreated(function () {
    var self = this;
    var instance = Template.instance();
    instance.employeeCount = new ReactiveVar(0);

    Meteor.call('employeeCount', function(err, count) {
        if(err) throw err;
        instance.employeeCount.set(count);
    });
});

Template.EmployeesPage.helpers({
    employeeCount: function() {
        return Template.instance().employeeCount.get();
    },

    hasEmployee: function() {
        var result = Meteor.relationships.find({type: 1}).count() > 0;
        result |= Collections.EmployeeRequests.find().count() > 0;
        return result;
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