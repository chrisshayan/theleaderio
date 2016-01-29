Package.describe({
	name: 'theleader:evaluation',
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
		'theleader:core',
		'theleader:post',

	]);
	api.addFiles([
		'common/model.js',
	]);

	api.addFiles([
		'server/methods.js'
	], 'server');
});

Package.onTest(function (api) {
	api.use('ecmascript');
	api.use('tinytest');
	api.use('theleader:evaluation');
	api.addFiles('evaluation-tests.js');
});
