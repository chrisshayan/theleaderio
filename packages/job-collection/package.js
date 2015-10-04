Package.describe({
    name: 'theleader:job-collection',
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
    api.use(['vsivsi:job-collection@1.2.3'], 'server');
    api.addFiles([
        'lib/job-collection.js',
        'lib/workers/send-email.js',
    ], 'server');

    api.export(['JobQueue'], 'server');
});

Package.onTest(function (api) {
    api.use('tinytest');
    api.use('theleader:job-collection');
    api.addFiles('job-collection-tests.js');
});
