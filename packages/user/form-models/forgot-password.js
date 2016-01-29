ForgotPasswordModel = Astro.Class({
	name: 'ForgotPasswordModel',
	fields: {
		email: {
			type: 'string',
			validator: [
				Validators.required(),
				Validators.email()
			]
		}
	}
});

Meteor.TheLeader.registerFormModel('ForgotPasswordModel', ForgotPasswordModel);