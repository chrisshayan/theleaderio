import './fixtures.js';
import './migrations';
import './routes';
import {MetricsJobs, QueueJobs} from '/imports/api/jobs/collections';


Meteor.startup(function () {
  process.env.MAIL_URL = Meteor.settings.MAILGUN_URL;
  // process.env.MAIL_URL = 'smtp://postmaster%40mail.theleader.io:04e27c0e13cbd45254e7aff7b4ed946a@smtp.mailgun.org:587';
  process.env.ROOT_URL = Meteor.settings.public.ROOT_URL;
  // Migrations.migrateTo('latest');

  // jobs
  MetricsJobs.startJobServer();
  QueueJobs.startJobServer();

});