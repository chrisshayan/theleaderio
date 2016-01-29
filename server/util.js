const {User} = Meteor.TheLeader.models;
createAdmin = function() {
	const userId = Accounts.createUser({
		email: 'admin@theleader.io',
		password: '123456'
	});
	if(userId) {
		Roles.addUsersToRoles(userId, User.ROLE.ADMIN);
	}
}