RequestInviteModel = Astro.Class({
	name: 'RequestInviteModel',
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
	}
});

Meteor.TheLeader.registerFormModel('RequestInviteModel', RequestInviteModel);