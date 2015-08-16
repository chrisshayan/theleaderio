Template.leaderRequestActions.events({
	'click .send-invite': function(e) {
		e.preventDefault();
		Meteor.call('sendLeaderInvitation', this._id, function(err, result) {
			if(err) throw err;
			if(result) {
				console.log("done");
			}
		});
	}
});
Template.leaderRequestActions.helpers({
	isStatus: function(status) {
		return this.status === status;
	}
});