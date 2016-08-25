import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// collections
import MetricsCollections from './collections';
import {Defaults } from '/imports/api/defaults/index';

// constants
import {DEFAULT_METRICS} from '/imports/utils/defaults'

export const Metrics = new MetricsCollections('metrics');

Metrics.publicFields = {};

Metrics.schema = new SimpleSchema({
  planId: {
    type: String
  },
  leaderId: {
    type: String
  },
  organizationId: {
    type: String
  },
  employeeId: {
    type: String,
    optional: true
  },
  metric: {
    type: String,
    allowedValues: DEFAULT_METRICS
  },
  score: {
    type: Number,
    allowedValues: [0, 1, 2, 3, 4, 5],
    defaultValue: 0
  },
  date: {
    type: Date
  }
});

Metrics.attachSchema(Metrics.schema);