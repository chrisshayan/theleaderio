const {Feedback} = Meteor.TheLeader.models;
const {Feedbacks} = Meteor.TheLeader.collections;

FeedbackContainer = React.createClass({
	mixins: [ReactMeteorData],
	getMeteorData() {
		const sub = Meteor.subscribe('Feedback.list');
		return {
			isLoading: !sub.ready(),
			items: Feedbacks.find().fetch()
		}
	},

	render() {
		return <FeedbackPage
				isLoading={this.data.isLoading}
				items={[1,2,3]} />;
	}
});