const {Request} = Meteor.TheLeader.models;
const {Requests} = Meteor.TheLeader.collections;

RightNavContainer = React.createClass({
	mixins: [ReactMeteorData],
	getMeteorData() {
		Meteor.subscribe('Request.list', {
			limit: 10,
			status: Request.STATUS.NEW
		});
		return {
			requests: Requests.find({status: Request.STATUS.NEW}).fetch()
		}
	},

	render() {
		return <RightNav requests={this.data.requests} />
	}
});