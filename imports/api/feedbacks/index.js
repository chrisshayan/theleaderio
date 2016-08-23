import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// collections
import FeedbacksCollections from './collections';

// constants
import {DEFAULT_METRICS} from '/imports/utils/defaults';

export const Feedbacks = new FeedbacksCollections('feedbacks');

Feedbacks.publicFields = {};

Feedbacks.schema = new SimpleSchema({
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
    allowedValues: DEFAULT_METRICS,
    optional: true
  },
  feedback: {
    type: String,
    optional: true
  },
  date: {
    type: Date
  }
});

Feedbacks.attachSchema(Feedbacks.schema);