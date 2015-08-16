Meteor.startup(function() {
	hasAdmin = Meteor.users.findOne({roles: "admin"});
	if(!hasAdmin) {
		var userId = Accounts.createUser({
			username: "admin",
			email: "admin@theleader.io",
			password: "123456"
		});
		if(userId) {
			Roles.addUsersToRoles(userId, [ROLE.ADMIN]);
		}
	}
});