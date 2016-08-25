import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collections
import SendingPlansCollection from './collections';
// import {Defaults} from '/imports/api/defaults/index';

// Constants
// const METRICS = Defaults.findOne({name: "METRICS"}).content;
const TIMEZONES = moment.tz.names();
const DEFAULT_TIMEZONES = Meteor.settings.public.localTimezone;

export const SendingPlans = new SendingPlansCollection('sending_plans');

SendingPlans.schema = new SimpleSchema({
  leaderId: {
    type: String
  },
  metric: {
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
  timezone: {
    type: String,
    allowedValues: TIMEZONES,
    defaultValue: DEFAULT_TIMEZONES
  },
  sendDate: {
    type: Date
  }
});

SendingPlans.attachSchema(SendingPlans.schema);