LoginModel = Astro.Class({
	name: 'LoginModel',
	fields: {
		email: {
			type: 'string',
			validator: [
				Validators.required(),
				Validators.string(),
				Validators.email()
			]
		},
		password: {
			type: 'string',
			validator: [
				Validators.required(),
				Validators.string()
			]
		}
	}
});

Meteor.TheLeader.registerFormModel('LoginModel', LoginModel);