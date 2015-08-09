Meteor.publish('employeeDetails', function(_id) {
	check(_id, String);
	if(!this.userId) return new Meteor.Error(403, 'User not login');
	return Collections.Employees.find({_id: _id}, {limit: 1});
});