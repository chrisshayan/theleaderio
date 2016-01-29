Package.describe({
	name: 'theleader:industry',
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
	api.use('theleader:core');
	api.addFiles([
		'common/model.js',
		'common/extend.js',
		'common/config.js',
	]);

	api.addFiles([
		'server/methods.js',
		'server/publications.js',
		'server/initData.js',
	], 'server');
});

Package.onTest(function (api) {
	api.use('ecmascript');
	api.use('tinytest');
	api.use('theleader:industry');
	api.addFiles('industry-tests.js');
});
