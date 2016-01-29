EmployeesContainer = React.createClass({
	mixins: [ReactMeteorData],

	getMeteorData() {
		Meteor.subscribe('users');
		return {
			canInvite: Meteor.users.find({_id: {$ne: Meteor.userId()}}).fetch()
		}
	},

	render() {
		return <Employees canInvite={this.data.canInvite} />;
	}
});