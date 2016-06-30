import './fixtures.js';

Meteor.startup(function () {
  process.env.MAIL_URL = 'smtp://postmaster%40mail.theleader.io:04e27c0e13cbd45254e7aff7b4ed946a@smtp.mailgun.org:587';
  process.env.ROOT_URL = 'devtheleader.io';
});