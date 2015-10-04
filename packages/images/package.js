Package.describe({
    name: 'theleader:images',
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
        'cfs:standard-packages',
        'cfs:gridfs',
        'cfs:autoform'
    ]);

    api.imply([
        'cfs:standard-packages',
        'cfs:gridfs',
        'cfs:autoform'
    ]);

    api.addFiles([
        'lib/common/collection.js'
    ]);
});

Package.onTest(function (api) {
    api.use('tinytest');
    api.use('theleader:images');
    api.addFiles('images-tests.js');
});
