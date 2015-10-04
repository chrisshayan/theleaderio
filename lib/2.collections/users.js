
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
    var profile = Meteor.user().getProfile();
	return profile.lastName + " " + profile.firstName;
};

User.prototype.headline = function() {
    var profile = Meteor.user().getProfile();
	return profile.headline;
}

User.prototype.leader = function() {
	var relation = Meteor.relationships.findOne({type: 1, elseId: this._id});
	if(!relation) return null;
	return Meteor.users.findOne({_id: relation.userId});
}


User.prototype.getProfile = function() {
    return Meteor.profiles.findOne({userId: this._id}) || {};
}
