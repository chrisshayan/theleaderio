User.prototype.isAdmin = function() {
	return Roles.userIsInRole(this, [ROLE.ADMIN]);
};

User.prototype.isLeader = function() {
	return Roles.userIsInRole(this, [ROLE.LEADER]);
};

User.prototype.isEmployee = function() {
	return Roles.userIsInRole(this, [ROLE.EMPLOYEE]);
};