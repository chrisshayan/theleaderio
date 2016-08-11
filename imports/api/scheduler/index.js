import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import SchedulerCollection from './collection';

// constants
export const INTERVAL = {
  EVERY_WEEK: "EVERY_WEEK",
  EVERY_2_WEEKS: "EVERY_2_WEEKS",
  EVERY_MONTH: "EVERY_MONTH"
};
export const METRICS = {
  PURPOSE: "PURPOSE",
  MEETINGS: "MEETINGS",
  RULES: "RULES",
  COMMUNICATIONS: "COMMUNICATIONS",
  LEADERSHIP: "LEADERSHIP",
  WORKLOAD: "WORKLOAD",
  ENERGY: "ENERGY",
  STRESS: "STRESS",
  DECISION: "DECISION",
  RESPECT: "RESPECT",
  CONFLICT: "CONFLICT"
};
export const QUARTER = {
  QUARTER_1: "QUARTER_1",
  QUARTER_2: "QUARTER_2",
  QUARTER_3: "QUARTER_3",
  QUARTER_4: "QUARTER_4",
};
export const STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE"
}


// Collection
export const Scheduler = new SchedulerCollection('scheduler');

// Schema
Scheduler.schema = new SimpleSchema({
  userId: {
    type: String
  },
  metrics: {
    type: [String],
    minCount: 1,
    maxCount: 3,
    allowedValues: [
      METRICS.PURPOSE, METRICS.MEETINGS, METRICS.RULES, METRICS.COMMUNICATIONS,
      METRICS.LEADERSHIP, METRICS.WORKLOAD, METRICS.ENERGY, METRICS.STRESS,
      METRICS.DECISION, METRICS.RESPECT, METRICS.CONFLICT
    ],
  },
  year: {
    type: Number
  },
  quarter: {
    type: String,
    allowedValues: [QUARTER.QUARTER_1, QUARTER.QUARTER_2, QUARTER.QUARTER_3, QUARTER.QUARTER_4]
  },
  interval: {
    type: String,
    allowedValues: [INTERVAL.EVERY_WEEK, INTERVAL.EVERY_2_WEEKS, INTERVAL.EVERY_MONTH],
    defaultValue: INTERVAL.EVERY_WEEK
  },
  status: {
    type: String,
    allowedValues: [STATUS.ACTIVE, STATUS.INACTIVE],
    defaultValue: STATUS.INACTIVE
  }
});

Scheduler.attachSchema(Scheduler.schema);
