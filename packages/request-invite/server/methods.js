const {RequestInvites} = Meteor.TheLeader.collections;

Meteor.TheLeader.registerApi({
	name: 'RequestInvite.reply',
	route: '/request-invite/reply',
	method: 'POST',
	action(body, params, queryParams) {
		const response = new LResponse();
		try {
			/**
			 * rule: user must logged in and is admin
			 */
			if (!this.userId) {
				return response.userNotLoggedIn().end();
			}
			const user = Meteor.users.findOne({_id: this.userId});
			if (!user.isAdmin()) return response.permissionDenied().end();

			// check request data
			const model = new RequestReplyModel(body);
			if (model.validate()) {
				// check request data
				const request = RequestInvites.findOne({_id: model.requestId});
				if (!request) {
					return response
						.notFound({requestId: 'Request invite not found'}, 'Request invite not found')
						.end();
				}

				// return error if update a request was connected
				if (request.status === RequestInvite.STATUS.CONNECTED) {
					return response
						.invalidParameter({
							status: 'Cannot update request was connected'
						}, 'Cannot update request was connected').end();
				}

				// update request with new status
				request.set('status', model.status);
				if (request.save()) {
					return response.success().end();
				}

				return response.unknownError().end();
			} else {
				return response.invalidParameter(model.getValidationErrors()).end();
			}

		} catch (e) {
			console.log("Error: Request invite - reply");
			console.trace(e);
			return response.unknownError().end();
		}
	}
});