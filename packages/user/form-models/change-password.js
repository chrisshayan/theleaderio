ChangePasswordModel = Astro.Class({
	name: 'ChangePasswordModel',
	fields: {
		currentPassword: {
			type: 'string',
			validator: [
				Validators.required(),
				Validators.string(),
			]
		},

		password: {
			type: 'string',
			validator: [
				Validators.required(),
				Validators.string(),
				Validators.minLength(6),
			]
		}
	}
});


Meteor.TheLeader.registerFormModel('ChangePasswordModel', ChangePasswordModel);