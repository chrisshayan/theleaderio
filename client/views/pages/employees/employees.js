Template.employees.events({
	'click .send-access-links': function() {
		Meteor.call('grantEmployeeAccessToken');
		swal("Sent!", "We sent invitations to employees", "success")
	}
})