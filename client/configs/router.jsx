//====================================================================//
// Check User Auth
//====================================================================//
function checkAuth() {
	if (!Meteor.loggingIn() && !Meteor.userId()) {
		const route = FlowRouter.current();
		if (['Login', 'Logout'].indexOf(route.route.name) < 0) {
			FlowRouter.go('Login', {}, {returnUrl: route.path});
		}
	}

	if (Meteor.userId()) {
		const route = FlowRouter.current();
		if (['Login'].indexOf(route.route.name) >= 0) {
			FlowRouter.go('App.home');
		}
	}
}

Accounts.onLogin(function () {
	const routeName = FlowRouter.current().route.name;
	if (routeName == 'Login') {
		const returnUrl = FlowRouter.getQueryParam('returnUrl');
		// redirect to url user access before
		if(returnUrl) FlowRouter.go(returnUrl);
		else FlowRouter.go('App.home');
	}
});

//====================================================================//
// Common routes
//====================================================================//
FlowRouter.notFound = {
	action() {
		ReactLayout.render(BlankLayout, {
			content: <PageNotFound />
		});
	}
};

FlowRouter.route('/', {
	name: 'LandingPage',
	action: function (params, queryParams) {
		ReactLayout.render(BlankLayout, {
			content: <LandingPage currentUser={Meteor.user()} />
		});
	}
});

FlowRouter.route('/login', {
	name: 'Login',
	action: function (params, queryParams) {
		ReactLayout.render(BlankLayout, {
			content: <Login />
		});
	}
});

FlowRouter.route('/logout', {
	name: 'Logout',
	action: function () {
		Meteor.logout(function() {
			FlowRouter.go('LandingPage');
		});
	}
});

FlowRouter.route('/request-invite', {
	name: 'RequestInvite',
	action: function (params, queryParams) {
		ReactLayout.render(BlankLayout, {
			content: <RequestInvite />
		});
	}
});

FlowRouter.route('/signup', {
	name: 'Signup',
	action: function (params, queryParams) {
		ReactLayout.render(BlankLayout, {
			content: <Signup />
		});
	}
});


FlowRouter.route('/forgot-password', {
	name: 'ForgotPassword',
	action: function (params, queryParams) {
		ReactLayout.render(BlankLayout, {
			content: <ForgotPassword />
		});
	}
});


FlowRouter.route('/reset-password/:token', {
	name: 'ForgotPassword',
	action: function (params, queryParams) {
		ReactLayout.render(BlankLayout, {
			content: <ResetPassword />
		});
	}
});


//=======================================================================//
// Main app routes
// to access routes with prefix /app , require user login
//=======================================================================//

const AppRoute = FlowRouter.group({
	name: 'App',
	prefix: '/app',
	triggersEnter: [checkAuth]
});

AppRoute.route('/', {
	name: 'App.home',
	action() {
		ReactLayout.render(MainLayout, {
			content: <Home title='Home Page' />
		});
	}
});

AppRoute.route('/profile', {
	name: 'App.myProfile',
	action() {
		ReactLayout.render(MainLayout, {
			content: <MyProfileContainer />
		});
	}
});

AppRoute.route('/employees', {
	name: 'App.employees',
	action() {
		ReactLayout.render(MainLayout, {
			content: <EmployeesContainer />
		});
	}
});

AppRoute.route('/feedback', {
	name: 'App.feedback',
	action() {
		ReactLayout.render(MainLayout, {
			content: <FeedbackContainer />
		});
	}
});

AppRoute.route('/measure', {
	name: 'App.measure',
	action() {
		ReactLayout.render(MainLayout, {
			content: <Measure />
		});
	}
});

AppRoute.route('/admin', {
	name: 'App.admin',
	action() {
		ReactLayout.render(MainLayout, {
			content: <AdminContainer />
		});
	}
});