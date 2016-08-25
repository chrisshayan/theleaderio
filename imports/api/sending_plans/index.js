import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Collections
import SendingPlansCollection from './collections';

// Constants
// const METRICS = Defaults.findOne({name: "METRICS"}).content;
const TIMEZONES = moment.tz.names();
const DEFAULT_TIMEZONES = Meteor.settings.public.localTimezone;

export const SendingPlans = new SendingPlansCollection('sending_plans');

SendingPlans.schema = new SimpleSchema({
  leaderId: {
    type: String
  },
  schedulerId: {
    type: String,
  },
  metric: {
    type: String,
    allowedValues: [
      "PURPOSE",
      "MEETINGS",
      "RULES",
      "COMMUNICATIONS",
      "LEADERSHIP",
      "WORKLOAD",
      "ENERGY",
      "STRESS",
      "DECISION",
      "RESPECT",
      "CONFLICT",
    ]
  },
  timezone: {
    type: String,
    allowedValues: TIMEZONES,
    defaultValue: DEFAULT_TIMEZONES
  },
  sendDate: {
    type: Date
  },
  status: {
    type: String,
    allowedValues: ['READY', 'SENT', 'FAILED']
  }
});

SendingPlans.attachSchema(SendingPlans.schema);
