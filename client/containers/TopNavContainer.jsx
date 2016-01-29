TopNavContainer = React.createClass({
	mixins: [ReactMeteorData],
	getMeteorData() {
		Meteor.subscribe('Request.count', {name: 'requestCounter'});
		return {
			requestCounter: Counts.get('requestCounter')
		};
	},

	render() {
		return <TopNav
				requestCounter={this.data.requestCounter || 0} />
	}
})