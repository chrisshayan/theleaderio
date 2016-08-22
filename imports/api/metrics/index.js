import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// collections
import MetricsCollections from './collections';
import {Defaults } from '/imports/api/defaults/index';

export const Metrics = new MetricsCollections('metrics');

Metrics.schema = new SimpleSchema({
  name: {
    type: String,
    allowedValues: [
      'purpose',
      'mettings',
      'rules',
      'communications',
      'leadership',
      'workload',
      'energy',
      'stress',
      'decision',
      'respect',
      'conflict'
    ]
  },
  score: {
    type: Number,
    allowedValues: [0, 1, 2, 3, 4, 5],
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