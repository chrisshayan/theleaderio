Request = Astro.Class({
	name: 'Request',
	collection: new Mongo.Collection('requests'),
	fields: {
		'type': {
			type: 'number',
			default() {
				/**
				 * 1: invite leader
				 * 2: invite employee by email
				 * 3: invite employee by userId
				 * 4: invite friend(as a leader) by email
				 * 5: invite friend(as a leader) by userId
				 */
				return 0;
			},
			validator: [
				Validators.required(),
				Validators.number()
			]
		},
		// requester
		'userId': {
			type: 'string',
			default() {
				return '';
			}
		},

		// receiver
		'otherId': {
			type: 'string',
			default() {
				return '';
			}
		},
		// request extra data
		'extra': {
			type: 'object',
			default() {
				return {};
			}
		},

		status: {
			/**
			 * 0: new
			 * 1: sent
			 * 2: accepted
			 * 3: Denied
			 */
			type: 'number',
			default() {
				return 0;
			}
		},

		createdAt: {
			type: 'date',
			default() {
				return new Date();
			}
		},

		updatedAt: {
			type: 'date',
			default() {
				return new Date();
			}
		}
	}
});

Meteor.TheLeader.registerModel('Request', Request);
Meteor.TheLeader.registerCollection('Requests', Request.getCollection());