Package.describe({
  name: 'theleader:feeds',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
    api.use([
        'socialize:base-model',
        'reywood:publish-composite',
        'socialize:user-model'
    ]);

    api.addFiles([
        'lib/common/feed.model.js',
        'lib/common/user.extend.js',
    ]);

    api.addFiles([
        'lib/server/publications.js',
        'lib/server/methods.js',
    ], 'server');

    api.export(['Feed']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('theleader:feeds');
  api.addFiles('feeds-tests.js');
});
