RequestInvite = Astro.Class({
	name: 'RequestInvite',
	collection: new Mongo.Collection('request_invites'),
	fields: {
		firstname: {
			type: 'string',
			validator: [
				Validators.required()
			]
		},
		lastname: {
			type: 'string',
			validator: [

			]
		},
		email: {
			type: 'string',
			validator: [
				Validators.required(),
				Validators.email()
			]
		},
		headline: {
			type: 'string',
			validator: [
			]
		},
		industries: {
			type: 'array',
			validator: [
			]
		},

		status: {
			type: 'string',
			default() {
				return RequestInvite.STATUS.NEW;
			}
		},
	}
});

Meteor.TheLeader.registerModel('RequestInvite', RequestInvite);
Meteor.TheLeader.registerCollection('RequestInvites', RequestInvite.getCollection());
