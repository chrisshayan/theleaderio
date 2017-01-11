import { Meteor } from 'meteor/meteor';
import { later } from 'meteor/mrt:later';

import './fixtures.js';
import './routes';
// import './migrate_intercom';
import { DailyJobs, QueueJobs, AdminJobs } from '/imports/api/jobs/collections';
import { Jobs } from '/imports/api/jobs/jobs';
import { Workers } from '/imports/api/jobs/workers';
import * as IntercomAPI from '/imports/api/intercom';
import {sendStatisticEmailToLeader, sendFeedbackEmailToLeader} from '/imports/api/jobs/methods';

// Sync user to intercom
Accounts.onCreateUser(function(options, user) {
  const {_id, emails, services} = user;
  let email = "";
  // if user login by external services
  if(_.isEmpty(emails)) {
    // login by google
    if(!_.isEmpty(services.google)) {
      email = user.services.google.email;
    }
    Accounts.users.update({_id}, {$set: {emails: [{address: email, verified: false}]}});
  } else {
    email = emails[0].address;
  }
  IntercomAPI.upsertUser({
    user_id: _id,
    email
  });
  return user;
});

Meteor.startup(function() {
  let type = "";

  process.env.MAIL_URL = Meteor.settings.MAILGUN_URL;
  // process.env.MAIL_URL = 'smtp://postmaster%40mail.theleader.io:04e27c0e13cbd45254e7aff7b4ed946a@smtp.mailgun.org:587';
  process.env.ROOT_URL = Meteor.settings.public.ROOT_URL;

  Migrations.config({
    log: true,
    logger: null,
    logIfLatest: true,
    collectionName: "migrations"
  });
  if(Meteor.settings['migrationVersion']) {
    Migrations.migrateTo(Meteor.settings.migrationVersion);
  }

  // Product Social Media Tag
  WebApp.addHtmlAttributeHook(function() {
    return {
      "itemscope": "",
      "itemtype": "http://schema.org/Product"
    }
  })

  // jobs
  if (Meteor.settings.jobs.enable.daily) {
    DailyJobs.startJobServer();
  }
  if (Meteor.settings.jobs.enable.queue) {
    QueueJobs.startJobServer();
  }
  if (Meteor.settings.jobs.enable.admin) {
    AdminJobs.startJobServer();
  }

  /**
   * DailyJobs
   * @job: enqueue_surveys
   * @job: measure metric
   */
  // sending survey email job
  if (!DailyJobs.find({ type: "enqueue_surveys" }).count()) {
    type = "enqueue_surveys";
    let attributes = {};
    if (Meteor.settings.public.env === "dev") {
      console.log(`dev environment`)
      attributes = { priority: "normal", repeat: { schedule: later.parse.text("every 5 minutes") } };
    } else {
      attributes = {
        priority: "normal",
        repeat: { schedule: later.parse.text(Meteor.settings.jobs.runTime.metricEmailSurvey) }
      };
    }
    var data = { type };
    Jobs.create(type, attributes, data);
  }
  // measure score of metric job
  if (!DailyJobs.find({ type: "measure_metric" }).count()) {
    type = "measure_metric";
    let attributes = {};
    if (Meteor.settings.public.env === "dev") {
      console.log(`dev environment`)
      attributes = { priority: "normal", repeat: { schedule: later.parse.text("every 5 minutes") } };
    } else {
      attributes = {
        priority: "normal",
        repeat: { schedule: later.parse.text(Meteor.settings.jobs.runTime.measureMetric) }
      };
    }
    const data = { type };
    Jobs.create(type, attributes, data);
  }
  // sending survey email job
  if (!AdminJobs.find({ type: "ask_questions" }).count()) {
    type = "ask_questions";
    let attributes = {};
    if (Meteor.settings.public.env === "dev") {
      console.log(`dev environment`)
      attributes = { priority: "normal", repeat: { schedule: later.parse.text("every 5 minutes") } };
    } else {
      attributes = {
        priority: "normal",
        repeat: { schedule: later.parse.cron(Meteor.settings.jobs.runTime.askQuestions) }
      };
    }
    var data = { type };
    Jobs.create(type, attributes, data);
  }
  /*
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
*/
  type = "enqueue_surveys";
  Workers.start(type);
  type = "measure_metric";
  Workers.start(type);
  type = "send_surveys";
  Workers.start(type);
  type = "ask_questions";
  Workers.start(type);
  type = "feedback_for_employee";
  AdminJobs.processJobs(type, sendFeedbackEmailToLeader);
  type = "statistic_for_leader";
  AdminJobs.processJobs(type, sendStatisticEmailToLeader);

});
