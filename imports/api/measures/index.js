import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import MeasuresCollection from './collections';

export const Measures = new MeasuresCollection('measures');

Measures.publicFields = {};

Measures.schema = new SimpleSchema({
  leaderId: {
    type: String
  },
  organizationId: {
    type: String
  },
  type: {
    type: String,
    allowedValues: ["metric", "feedback"]
  },
  interval: {
    type: String,
    allowedValues: ["daily", "weekly", "monthly"],
    defaultValue: "monthly"
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
    type: {Object}
  }
});

Measures.attachSchema(Measures.schema);