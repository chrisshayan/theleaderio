Meteor.startup(function () {
	Accounts.config({
		sendVerificationEmail: true, // send email verify after create user
		forbidClientAccountCreation: true // disable call Accounts.createUser from client
	});

	/**
	 * Allow only login with email verified
	 */
	//var loginAttemptVerifier = function (parameters) {
	//	if (parameters.user && parameters.user.emails && (parameters.user.emails.length > 0)) {
	//		// return true if verified email, false otherwise.
	//		var found = _.find(
	//			parameters.user.emails,
	//			function (thisEmail) {
	//				return thisEmail.verified
	//			}
	//		);
	//
	//		if (!found) {
	//			throw new Meteor.Error(500, 'We sent you an email.');
	//		}
	//		return found && parameters.allowed;
	//	} else {
	//		console.log("user has no registered emails.");
	//		return false;
	//	}
	//};
	//Accounts.validateLoginAttempt(loginAttemptVerifier);

	/**
	 * Change common accounts urls
	 */
	Accounts.urls.resetPassword = function (token) {
		return Meteor.absoluteUrl('reset-password/' + token);
	};

	// init profile when create user
	Accounts.onCreateUser(function (options, user) {
		const profile = new Profile();
		if (options.profile) {
			profile.set(options.profile);
		}

		user.profile = profile.raw();
		user.roles = [];
		return user;
	});


});

