const {Feedbacks} = Meteor.TheLeader.collections;

Meteor.TheLeader.registerPublish('Feedback.list', function() {
	if(!this.userId) return null;
	return {
		find() {
			return Feedbacks.find();
		}
	}
});