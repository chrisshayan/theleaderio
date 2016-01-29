MyProfileContainer = React.createClass({
	mixins: [ReactMeteorData],

	getMeteorData() {
		const user = Meteor.user();

		return {
			profile: user && user.profile ? user.profile : {}
		};
	},

	render() {
		return <MyProfile profile={this.data.profile} />;
	}
});