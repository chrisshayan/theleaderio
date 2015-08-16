
User.prototype.isAdmin = function() {
	return Roles.userIsInRole(this, [ROLE.ADMIN]);
};

User.prototype.isLeader = function() {
	return Roles.userIsInRole(this, [ROLE.LEADER]);
};

User.prototype.isEmployee = function() {
	return Roles.userIsInRole(this, [ROLE.EMPLOYEE]);
};

User.prototype.fullname = function() {
	return this.profile.lastName + " " + this.profile.firstName;
};

User.prototype.headline = function() {
	return this.profile.headline;
}

User.prototype.leader = function() {
	var relation = Collections.Relationships.findOne({type: 1, elseId: this._id});
	if(!relation) return null;
	return Meteor.users.findOne({_id: relation.userId});
}
