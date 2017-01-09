import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// collections
import FeedbacksCollections from './collections';

// constants
import {DEFAULT_METRICS} from '/imports/utils/defaults';

export const Feedbacks = new FeedbacksCollections('feedbacks');
export const FEEDBACK_TYPES = {
  EMPLOYEE_TO_LEADER: "EMPLOYEE_TO_LEADER",
  LEADER_TO_EMPLOYEE: "LEADER_TO_EMPLOYEE"
};

// public fields
Feedbacks.publicFields = {leaderId: true, feedback: true, date: true, type: true};

Feedbacks.schema = new SimpleSchema({
  planId: {
    type: String,
    optional: true
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
  type: {
    type: String,
    optional: true,
    allowedValues: [FEEDBACK_TYPES.EMPLOYEE_TO_LEADER, FEEDBACK_TYPES.LEADER_TO_EMPLOYEE],
    defaultValue: FEEDBACK_TYPES.EMPLOYEE_TO_LEADER
  },
  date: {
    type: Date
  }
});

Feedbacks.attachSchema(Feedbacks.schema);