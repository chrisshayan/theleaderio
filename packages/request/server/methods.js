const {User, Relationship, Request} = Meteor.TheLeader.models;
const {Requests, Relationships} = Meteor.TheLeader.collections;

Meteor.TheLeader.registerApi({
	name: 'Request.invite.employee',
	route: '/request/invite/employee',
	method: 'post',
	action(body, params) {
		this.unblock();
		const response = new LResponse();
		try {
			let user = null;
			let email = null;

			if (body.email) {
				// invite via email
				user = Accounts.findUserByEmail(body.email);
				email = body.email;
			} else if (body.employeeId) {
				user = Meteor.users.findOne({_id: body.employeeId});
			}

			if (user) {
				// check request exists
				let request = Requests.findOne({
					userId: this.userId,
					otherId: user._id,
					type: Request.TYPE.INVITE_EMPLOYEE_BY_ID
				});

				if (!request) {
					request = new Request({
						userId: this.userId,
						otherId: user._id,
						type: Request.TYPE.INVITE_EMPLOYEE_BY_ID
					}).save();

					if (request) {
						return response.success().end();
					} else {
						return response.unknownError().end();
					}

				} else {
					return response.unknownError().end();
				}
			} else {
				if (email) {
					// invite via email
				} else {
					// return error
				}
			}
		} catch (e) {
			console.log("Error: Request invite employee");
			console.trace(e);
			return response.unknownError().end();
		}
	}
});

/**
 * Adapter to validate reply data
 */
const ReplyModel = Astro.Class({
	name: 'ReplyModel',
	fields: {
		requestId: {
			validator: [
				Validators.required(),
				Validators.string()
			]
		},

		accept: {
			validator: [
				Validators.required(),
				Validators.boolean()
			]
		}
	}
});

/**
 * Api to response a request
 * @param body.requestId {string}
 * @param body.accept {boolean} true is accept, false is deny
 */
Meteor.TheLeader.registerApi({
	name: 'Request.reply',
	route: '/request/reply',
	method: 'post',
	action(body, params) {
		this.unblock();
		const response = new LResponse();
		try {
			const model = new ReplyModel(body);
			if (model.validate()) {
				const request = Requests.findOne({_id: model.requestId});
				if (!request) {
					return response.notFound({requestId: 'Request not found'}, 'Request not found').end();
				} else {
					if (request.otherId != this.userId) {
						return response
							.permissionDenied({}, 'You don\'t have permission on this request')
							.end();
					} else {
						const status = model.accept ? Request.STATUS.ACCEPTED : Request.STATUS.DENIED;
						request.set('status', status);
						if (request.save()) {
							if (status === Request.STATUS.ACCEPTED) {
								const relationship = new Relationship({
									type: Relationship.TYPE.LEADER_EMPLOYEE,
									userId: request.userId,
									otherId: request.otherId
								});

								if (!relationship.save()) {
									return response.unknownError().end();
								}
							}

							return response.success().end();
						} else {
							return response.unknownError().end();
						}
					}
				}

			} else {
				return response
					.invalidParameter(model.getValidationErrors())
					.end();
			}
		} catch (e) {
			console.log("Error: Reply a request");
			console.trace(e);
			return response.unknownError().end();
		}
	}
});

/**
 * Get requests
 */
Meteor.TheLeader.registerApi({
	name: 'Request.list',
	route: '/request/list',
	method: 'GET',
	action(body, params, queryParams) {
		this.unblock();
		const response = new LResponse();
		try {
			const selector = {
				status: Request.STATUS.NEW
			};
			if (queryParams.sinceId) {
				selector['_id'] = {
					"$gt": queryParams.sinceId
				};
			}
			const options = {
				limit: queryParams.limit,
				skip: queryParams.offset,
				sort: {
					createdAt: -1
				},
				transform: null
			};
			const cursor = Requests.find(selector, options);
			return response
				.success({
					total: cursor.count(),
					items: cursor.map(Request.mapToApi)
				})
				.end();

		} catch (e) {
			console.log("Error: Get request list");
			console.trace(e);
			return response.unknownError().end();
		}
	}
});