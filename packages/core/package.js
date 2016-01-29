Package.describe({
	name: 'theleader:core',
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
	api.versionsFrom('1.2.1');
	api.use([
		'ecmascript',
		'ejson',
		'mongo',
		'check',
		'accounts-password',
		'matb33:collection-hooks@0.8.1',
		'jagi:astronomy@1.2.10',
		'jagi:astronomy-validators@1.1.2',
		'meteorhacks:aggregate@1.3.0',
		'vsivsi:job-collection@1.2.3',
		'simple:rest@1.1.0',
		'simple:json-routes@2.0.0',
		'simple:authenticate-user-by-token',
		'simple:rest-bearer-token-parser',
		'reywood:publish-composite@1.4.2',
		'tmeasday:publish-counts@0.7.3'
	]);

	/**
	 * share core packages
	 */
	api.imply([
		'ecmascript',
		'ejson',
		'mongo',
		'check',
		'accounts-password',
		'matb33:collection-hooks',
		'jagi:astronomy',
		'jagi:astronomy-validators',
		'meteorhacks:aggregate',
		'simple:rest',
		'simple:json-routes',
		'simple:authenticate-user-by-token',
		'simple:rest-bearer-token-parser',
		'reywood:publish-composite',
		'tmeasday:publish-counts'
	]);

	api.addFiles([
		'server/api-routes-config.js',
	], 'server');

	api.addFiles([
		'common/LQueryParams.js',
		'common/LCore.js',
		'common/LResponse.js',
		'common/BackgroundTaskServer.js',
		'init.js'
	]);
});

Package.onTest(function (api) {
	api.use('ecmascript');
	api.use('tinytest');
	api.use('theleader:core');
	api.addFiles('core-tests.js');
});
