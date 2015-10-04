Package.describe({
    name: 'theleader:users',
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
        'socialize:base-model',
        'reywood:publish-composite',
        'theleader:images',
        'yogiben:autoform-file@0.2.9'
    ]);
    api.imply('theleader:images');
    api.addFiles([
        'lib/common/profile.model.js'
    ]);

    api.addFiles([
        'lib/server/publications.js'
    ], 'server');

    api.export(['Profile']);
});

Package.onTest(function (api) {
    api.use('tinytest');
    api.use('theleader:users');
    api.addFiles('users-tests.js');
});
