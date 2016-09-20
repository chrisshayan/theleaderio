import {Meteor} from 'meteor/meteor';
import {later} from 'meteor/mrt:later';

import './fixtures.js';
import './migrations';
import './routes';
import {DailyJobs, QueueJobs} from '/imports/api/jobs/collections';
import {Jobs} from '/imports/api/jobs/jobs';
import {Workers} from '/imports/api/jobs/workers';

Meteor.startup(function () {
  let type = "";

  process.env.MAIL_URL = Meteor.settings.MAILGUN_URL;
  // process.env.MAIL_URL = 'smtp://postmaster%40mail.theleader.io:04e27c0e13cbd45254e7aff7b4ed946a@smtp.mailgun.org:587';
  process.env.ROOT_URL = Meteor.settings.public.ROOT_URL;
  // Migrations.migrateTo('latest');

  // jobs
  // DailyJobs.startJobServer();
  QueueJobs.startJobServer();

  /**
   * DailyJobs
   * @job: enqueue_surveys
   * @job: measure metric
   */
  // sending survey email job
  if (!DailyJobs.find({type: "enqueue_surveys"}).count()) {
    type = "enqueue_surveys";
    let attributes = {};
    if (Meteor.settings.public.env === "dev") {
      console.log(`dev environment`)
      attributes = {priority: "normal", repeat: {schedule: later.parse.text("every 5 minutes")}};
    } else {
      attributes = {
        priority: "normal",
        repeat: {schedule: later.parse.text(Meteor.settings.jobs.runTime.metricEmailSurvey)}
      };
    }
    var data = {type};
    Jobs.create(type, attributes, data);
  }
  // measure score of metric job
  if (!DailyJobs.find({type: "measure_metric"}).count()) {
    type = "measure_metric";
    let attributes = {};
    if (Meteor.settings.public.env === "dev") {
      console.log(`dev environment`)
      attributes = {priority: "normal", repeat: {schedule: later.parse.text("every 5 minutes")}};
    } else {
      attributes = {
        priority: "normal",
        repeat: {schedule: later.parse.text(Meteor.settings.jobs.runTime.measureMetric)}
      };
    }
    const data = {type};
    Jobs.create(type, attributes, data);
  }
  // migrate data for users
  if (Meteor.settings.migration) {
    type = "migration";
    const attributes = {
        priority: "normal",
        after: new Date()
      },
      data = {type}
      ;
    Jobs.create(type, attributes, data);
    Workers.start(type);
  }

  type = "enqueue_surveys";
  Workers.start(type);
  type = "measure_metric";
  Workers.start(type);

});