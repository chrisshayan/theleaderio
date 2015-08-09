if (Meteor.isServer) {
    // Assign role(s) after created user
    Meteor.users.after.insert(function(userId, user) {
        if (user._id) {
            Roles.addUsersToRoles(user._id, [ROLE.LEADER])
        }
    });
}
