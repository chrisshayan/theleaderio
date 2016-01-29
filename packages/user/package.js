Package.describe({
	name: 'theleader:user',
	version: '0.0.1',
	// Brief, one-line summary of the package.
	summary: '',
	// URL to the Git repository containing the source code for this package.
	git: '',
	// By default, Meteor will default to using README.md for documentation.
	// To avoid submitting documentation, set this field to null.
	documentation: 'README.md'
});

Package.onUse(function (api) {
	api.use([
		'accounts-password',
		'check',
		'simple:json-routes@2.0.0',
		'simple:authenticate-user-by-token@1.0.0',
		'simple:rest-bearer-token-parser@1.0.0',
		'alanning:roles@1.2.14',
		'theleader:core',
		'theleader:industry',
		'theleader:request-invite',
	]);
	api.imply('alanning:roles');

	api.addFiles([
		'common/model.js',
		'common/config.js',
		'common/extends.js',

		'form-models/login.js',
		'form-models/change-password.js',
		'form-models/forgot-password.js',
		'form-models/request-invite.js',
		'form-models/signup.js',
	]);

	api.addFiles([
		'server/config/accounts.js',
		'server/methods.js',
		'server/publications.js',
	], 'server');

	api.export(['ForgotPasswordModel']);
});

Package.onTest(function (api) {
	api.use('ecmascript');
	api.use('tinytest');
	api.use('theleader:user');
	api.addFiles('user-tests.js');
});
