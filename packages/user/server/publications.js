Meteor.TheLeader.registerPublish('User.all', function(selector, options, counter) {
	check(counter, String);
	check(selector, Object);
	check(options, Object);

	/**
	 * Only admin can access this data
	 */
	if(!this.userId) return false;
	const user = Meteor.users.findOne({_id: this.userId});
	if(!user || !user.isAdmin()) return false;
	options.tranform = null;

	return {
		find() {
			const cursor = Meteor.users.find(selector, options);
			//Counts.publish(this, counter, cursor);
			return cursor;
		}
	}
});