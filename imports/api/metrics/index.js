import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// collections
import MetricsCollections from './collections';
import {Defaults } from '/imports/api/defaults/index';

// constants
const METRICS = Defaults.findOne({name: "METRICS"}).content;
const SCORES = Defaults.findOne({name: "SCORES"}).content;

export const Metrics = new MetricsCollections('metrics');

Metrics.schema = new SimpleSchema({
  name: {
    type: String,
    allowedValues: METRICS
  },
  score: {
    type: Number,
    allowedValues: SCORES,
    defaultValue: 0
  },
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
    type: String
  },
  date: {
    type: Date
  },
  data: {
    type: Object,
    optional: true
  }
});

Metrics.attachSchema(Metrics.schema);