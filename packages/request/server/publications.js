const {User} = Meteor.TheLeader.models;
const {Requests} = Meteor.TheLeader.collections;

/**
 * Generate publish data
 * @param userId {string}
 * @param limit {integer}
 * @param status {integer} Refer to Request.STATUS
 * @returns {*}
 */
function requestPublish(userId, limit = 10, status = null) {
	return {
		find() {
			const selector = {
				otherId: userId
			};
			const options = {
				limit: limit,
				sort: {
					createdAt: -1
				}
			};

			// filter by status
			if(status) {
				selector.status = status;
			}

			return Requests.find(selector, options);
		},

		children: [
			{
				// publish requester info
				find(request) {
					return Meteor.users.find({_id: request.userId}, {fields: User.PUBLIC_FIELDS});
				}
			}
		]
	};
}

/**
 * publish requests
 * @param data {Object}
 * @param data.limit {Integer}
 * @param data.status {Integer} Refer to Request.STATUS
 */
Meteor.TheLeader.registerPublish('Request.list', function ({limit = 10, status = null}) {
	if (!this.userId) return null;
	check(limit, Number);
	check(status, String);
	return requestPublish(this.userId, limit, status);
});

/**
 * Count request unread
 */
Meteor.publish('Request.count', function({name}) {
	if(!this.userId) return null;
	check(name, String);

	const cursor = Requests.find({
		otherId: this.userId,
		status: Request.STATUS.NEW
	}, {fields: {_id: 1}});
	Counts.publish(this, name, cursor);
	return this.ready();
});