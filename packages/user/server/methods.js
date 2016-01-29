JsonRoutes.Middleware.use(JsonRoutes.Middleware.authenticateMeteorUserByToken);
JsonRoutes.Middleware.use(JsonRoutes.Middleware.parseBearerToken);

const {RequestInvite} = Meteor.TheLeader.models;
const {RequestInvites, Industries} = Meteor.TheLeader.collections;

/**
 * Request invite
 *
 * @param body.firstname {string}
 * @param body.lastname {string}
 * @param body.email {string}
 * @param body.headline {string}
 * @param body.industries {array} industry ids
 */
Meteor.TheLeader.registerApi({
	name: 'User.requestInvite',
	route: '/user/request-invite',
	method: 'POST',
	action(body, queryParams) {
		const response = new LResponse();
		try {
			const model = new RequestInvite(body);
			if (model.validate()) {

				// check user exists
				const user = Accounts.findUserByEmail(model.email);
				if (user) {
					return response.invalidParameter({
						email: 'This user already exists'
					}, 'This user already exists').end();
				}

				// check user requested invitation
				if (RequestInvites.findOne({email: model.email})) {
					return response.invalidParameter({
						email: 'This email already requested'
					}, 'This email already requested').end();
				}

				if (model.save()) {
					return response.success().end();
				}
				return response.unknownError().end();
			} else {
				return response
					.invalidParameter(model.getValidationErrors())
					.end();
			}
		} catch (e) {
			console.log("Error: Request invite");
			console.trace(e);
			return response.unknownError().end();
		}
	}
});


/**
 * Signup
 *
 * @param body.firstname {string}
 * @param body.lastname {string}
 * @param body.email {string}
 * @param body.headline {string}
 * @param body.industries {array} industry ids
 */
Meteor.TheLeader.registerApi({
	name: 'User.signup',
	route: '/user/signup',
	method: 'POST',
	action(body, queryParams) {
		const response = new LResponse();
		try {
			const model = new SignupModel(body);
			if (model.validate()) {

				// check user exists
				const user = Accounts.findUserByEmail(model.email);
				if (user) {
					return response.invalidParameter({
						email: 'This user already exists'
					}, 'This user already exists').end();
				}

				// check email exists in request invites
				const requestInvite = RequestInvites.findOne({email: model.email});
				if(!requestInvite) {
					return response
						.permissionDenied({
							email: 'You have to request an invitation before sign up.'
						}, 'You have to request an invitation before sign up.')
						.end();
				} else {
					if(requestInvite.status !== RequestInvite.STATUS.APPROVED) {
						return response
							.invalidParameter({
								email: 'This email need approval before sign up.'
							}, 'This email need approval before sign up.')
							.end();
					}
				}

				if (model.industries && model.industries.length > 0) {
					const validCount = Industries.find({_id: {$in: model.industries}}).count();
					if (validCount != model.industries.length) {
						return response
							.invalidParameter({industries: 'contain invalid industries'}, 'Data contains invalid industries.')
							.end();
					}
				}

				const userId = Accounts.createUser({
					email: model.email,
					password: model.password,
					profile: model.profile().raw()
				});
				if(userId) {
					/**
					 * update all info invoked before signup
					 *
					 * 1. update request invite
					 */
					Meteor.defer(() => {
						const requestInvite = RequestInvites.findOne({email: model.email});
						if(requestInvite) {
							requestInvite.set('status', RequestInvite.STATUS.CONNECTED);
							requestInvite.save();
						}
					});
					return response.success({userId}).end();
				}
				return response.unknownError().end();
			} else {
				return response
					.invalidParameter(model.getValidationErrors())
					.end();
			}
		} catch (e) {
			console.log("Error: Signup");
			console.trace(e);
			return response.unknownError().end();
		}
	}
});

/**
 * Login api
 *
 * @param body {object}
 * @param body.email {string}
 * @param body.password {string}
 * @return {LResponse}
 * with payload success should be
 * - payload.userId {string}
 * - payload.token {string}
 * - payload.tokenExpires {string}
 */
Meteor.TheLeader.registerApi({
	name: 'User.login',
	route: '/user/login',
	method: 'POST',
	action(body, queryParams) {
		try {
			const response = new LResponse();
			const model = new LoginModel(body);
			let user;

			if (model.validate()) {
				// find user
				user = Accounts.findUserByEmail(model.email);
				if (!user) {
					return response
						.notFound({email: 'Email address not found'}, 'User with that email address not found.')
						.end();
				}

				// verify password
				const result = Accounts._checkPassword(user, model.password);

				// result must contains userId and error, if not, output unknown error
				if (!result.userId && !result.error) return response.unknownError().end();

				// if result.error exists , output incorrect password
				if (result.error) {
					return response
						.invalidParameter({password: result.error.reason}, result.error.reason)
						.end();
				}

				// NOW, User valid
				// generate login token
				const stampedLoginToken = Accounts._generateStampedLoginToken();

				// stampedLoginToken must have schema {token: <String>, when: <Date>}
				if (!stampedLoginToken.token || !stampedLoginToken.when)
					return response.unknownError().end();

				// Insert login token to user document
				Accounts._insertLoginToken(user._id, stampedLoginToken);

				const tokenExpiration = Accounts._tokenExpiration(stampedLoginToken.when);
				const payload = {
					userId: user._id,
					token: stampedLoginToken.token,
					tokenExpires: tokenExpiration
				};
				return response.success(payload).end();
			} else {
				return response
					.invalidParameter(model.getValidationErrors())
					.end();
			}
		} catch (e) {
			return new LResponse().unknownError().end();
		}
	}
});


/**
 * Request a forgot password email.
 *
 * @param body {object}
 * @param body.email {object} required
 * @return {LResponse}
 */
Meteor.TheLeader.registerApi({
	name: 'User.forgotPassword',
	route: '/user/forgot-password',
	method: 'POST',
	action(body) {
		const response = new LResponse();
		try {
			const model = new ForgotPasswordModel(body);
			if (model.validate()) {
				const user = Accounts.findUserByEmail(model.email);
				if (!user) {
					return response
						.notFound({email: 'User not found'}, 'User not found')
						.end();
				}

				const result = Accounts.sendResetPasswordEmail(user._id);

				if (!result) {
					return response
						.success()
						.setMessage('Instructions for accessing your account have been sent to ' + model.email)
						.end()
				}
				return response.unknownError().end();
			} else {
				return response
					.invalidParameter(model.getValidationErrors())
					.end();
			}
		} catch (e) {
			console.log('Error: Forgot password');
			console.trace(e);

			return response.unknownError().end();
		}
	}
});

/**
 * Forcibly change the password for a user
 *
 * @param body {object}
 * @param body.currentPassword {string} required
 * @param body.password {string} required
 * @return {LResponse}
 */
Meteor.TheLeader.registerApi({
	name: 'User.changePassword',
	route: '/user/change-password',
	method: 'POST',
	action(body) {
		const response = new LResponse();
		try {
			if (!this.userId) return response.userNotLoggedIn().end();

			const model = new ChangePasswordModel(body);
			if (model.validate()) {
				const user = Meteor.users.findOne({_id: this.userId})
				const result = Accounts._checkPassword(user, model.currentPassword);

				// result must contains userId and error, if not, output unknown error
				if (!result.userId && !result.error) return response.unknownError().end();

				// if result.error exists , output incorrect password
				if (result.error) {
					return response
						.invalidParameter({currentPassword: result.error.reason}, result.error.reason)
						.end();
				}

				if (!Accounts.setPassword(user._id, model.password)) {
					return response.success().end();
				}
				return response.unknownError().end();
			} else {
				return response
					.invalidParameter(model.getValidationErrors())
					.end();
			}
		} catch (e) {
			console.log('Error: Change password');
			console.trace(e);

			return response.unknownError().end();
		}
	}
});


/**
 * Get user profile
 * method: GET
 * endpoint: /user/profile
 */
Meteor.TheLeader.registerApi({
	name: 'User.profile',
	route: '/user/profile',
	method: 'GET',
	action() {
		const response = new LResponse();
		try {
			if (!this.userId) return response.userNotLoggedIn().end();

			const user = Meteor.users.findOne({_id: this.userId});
			return response.success(user.myProfile()).end();
		} catch (e) {
			console.log("//----------------------//")
			console.log("Get profile");
			console.trace(e);
			return response.unknownError().end();
		}
	}
});

/**
 * Update user profile
 *
 * @param body {object}
 * @param body.firstname {string}
 * @param body.lastname {string}
 * @param body.headline {string}
 * @param body.picture {string}
 * @param body.bio {string}
 * @param body.industries {array}
 *
 * @return {LResponse}
 */
Meteor.TheLeader.registerApi({
	name: 'User.profile.update',
	route: '/user/profile',
	method: 'PUT',
	action(data) {
		const response = new LResponse();

		try {
			if (!this.userId) return response.userNotLoggedIn().end();

			const user = Meteor.users.findOne({_id: this.userId});
			const model = new Profile(data);

			if (model.validate()) {
				const profile = _.extend(user.profile, model.getModified());
				const result = Meteor.users.update({_id: user._id}, {
					$set: {profile}
				});

				if (result) {
					return response.success().end();
				} else {
					return response.unknownError().end();
				}
			} else {
				return response
					.invalidParameter(model.getValidationErrors())
					.end();
			}
		} catch (e) {
			return response.unknownError().end();
		}
	}
});