SignupModel = Astro.Class({
	name: 'SignupModel',
	fields: {
		firstname: {
			type: 'string',
			validator: [
				Validators.required()
			]
		},

		lastname: {
			type: 'string'
		},

		email: {
			type: 'string',
			validator: [
				Validators.required(),
				Validators.email()
			]
		},

		password: {
			type: 'string',
			validator: [
				Validators.required(),
				Validators.minLength(6),
			]
		},

		headline: {
			type: 'string'
		},

		industries: {
			type: 'array',
			nested: 'string'
		}

	},

	methods: {
		profile() {
			const data = this.raw();
			delete data['email'];
			return new Profile(data);
		}
	}
});

Meteor.TheLeader.registerFormModel('SignupModel', SignupModel);