const {Industries} = Meteor.TheLeader.collections;

/**
 * Get all industries
 * method: GET
 * endpoint: /industries
 */
Meteor.TheLeader.registerApi({
	name: 'Industry.list',
	route: '/industries',
	method: 'GET',
	action() {
		const response = new LResponse();
		try {
			const payload = {
				industries: Industries.find({}, {transform: null}).fetch()
			};
			return response.success(payload).end();
		} catch (e) {
			console.log("//----------------------//")
			console.log("Get all industries");
			console.trace(e);
			return response.unknownError().end();
		}
	}
});