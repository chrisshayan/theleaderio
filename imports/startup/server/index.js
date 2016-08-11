import './fixtures.js';
import './migrations';
import {MetricsJobs} from '/imports/api/jobs/collections';


Meteor.startup(function () {
  process.env.MAIL_URL = `smtp://${Meteor.settings.public.MAILGUN_URL}`;
  process.env.ROOT_URL = Meteor.settings.public.ROOT_URL;
  // Migrations.migrateTo('latest');

  MetricsJobs.startJobServer();
});