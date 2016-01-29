RequestReplyModel = Astro.Class({
	name: 'RequestReplyModel',
	fields: {
		requestId: {
			type: 'string',
			validator: [
				Validators.required()
			]
		},

		status: {
			type: 'string',
			validator: [
				Validators.required(),
				Validators.choice(_.toArray(RequestInvite.STATUS))
			]
		}
	}
});