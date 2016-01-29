const {RequestInvites} = Meteor.TheLeader.collections;

Meteor.TheLeader.registerPublish('RequestInvite.all', function(selector, options, counter) {
	check(counter, String);
	check(selector, Object);
	check(options, Object);

	/**
	 * Only admin can access this data
	 */
	if(!this.userId) return false;
	const user = Meteor.users.findOne({_id: this.userId});
	if(!user || !user.isAdmin()) return false;

	options.transform = null;

	return {
		find() {
			const cursor = RequestInvites.find(selector, options);
			//Counts.publish(this, counter, cursor);
			return cursor;
		}
	}
});