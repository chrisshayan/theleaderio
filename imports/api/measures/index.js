import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import MeasuresCollection from './collections';

export const Measures = new MeasuresCollection('measures');

export const
  MEASURE_TYPES = {
  metric: "metric",
  feedback: "feedback",
  statistic: "statistic"
},
  MEASURE_INTERVALS = {
    daily: "daily",
    weekly: "weekly",
    monthly: "monthly"
  }
;

Measures.publicFields = {};

Measures.schema = new SimpleSchema({
  leaderId: {
    type: String,
    optional: true
  },
  organizationId: {
    type: String,
    optional: true
  },
  type: {
    type: String,
    allowedValues: [MEASURE_TYPES.metric, MEASURE_TYPES.feedback, MEASURE_TYPES.statistic]
  },
  interval: {
    type: String,
    allowedValues: [MEASURE_INTERVALS.daily, MEASURE_INTERVALS.weekly, MEASURE_INTERVALS.monthly],
    defaultValue: MEASURE_INTERVALS.monthly,
    optional: true
  },
  year: {
    type: Number,
    optional: true
  },
  month: {
    type: Number,
    optional: true
  },
  day: {
    type: Number,
    optional: true
  },
  key: {
    type: String
  },
  value: {
    type: Object,
    optional: true
  },
  "value.averageScore": {
    type: String,
    optional: true
  },
  "value.noOfScores": {
    type: Number,
    optional: true
  },
  "value.noOfGoodScores": {
    type: Number,
    optional: true
  },
  "value.noOfUsers": {
    type: Number,
    optional: true
  },
  "value.noOfOrganizations": {
    type: Number,
    optional: true
  },
  "value.noOfEmployees": {
    type: Number,
    optional: true
  },
  "value.noOfEmailWelcome": {
    type: Number,
    optional: true
  },
  "value.noOfEmailForgotAlias": {
    type: Number,
    optional: true
  },
  "value.noOfEmailForgotPassword": {
    type: Number,
    optional: true
  },
  "value.noOfEmailSurvey": {
    type: Number,
    optional: true
  },
  "value.noOfEmailScoringError": {
    type: Number,
    optional: true
  },
  "value.noOfEmailFeedbackToLeader": {
    type: Number,
    optional: true
  },
  "value.noOfEmailFeedbackToEmployee": {
    type: Number,
    optional: true
  },
  "value.noOfEmailDigestToLeader": {
    type: Number,
    optional: true
  },
  "value.noOfEmailReferral": {
    type: Number,
    optional: true
  }
});

Measures.attachSchema(Measures.schema);