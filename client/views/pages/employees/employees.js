Template.employees.events({
	'click .send-access-links': function() {
		Meteor.call('sendEmployeeInvitations');
		swal("Sent!", "We sent invitations to employees", "success")
	}
})


Template.employeeRequestActions.events({
	'click .send-invite': function(e) {
		e.preventDefault();
		Meteor.call('sendEmployeeInvitations', [this._id], function(err, result) {
			if(err) throw err;
			if(result) {
				toastr.success("success", "Send invitation");
			}
		});
	}
});
Template.employeeRequestActions.helpers({
	isStatus: function(status) {
		return this.status === status;
	}
});