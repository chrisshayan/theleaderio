import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import eNPSCollection from './collections';

export const eNPS = new eNPSCollection('enps') ;

eNPS.allowedScores = [0, 1, 2, 3, 4, 5, 6];
eNPS.allowedIntervals = ["EVERY_MONTH"];

eNPS.schema = new SimpleSchema({
  leaderId: {
    type: String
  },
  organizationId: {
    type: String
  },
  interval: {
    type: String,
    allowedValues: eNPS.allowedIntervals,
    defaultValue: "EVERY_MONTH",
    optional: true
  },
  scores: {
    type: [Object],
    optional: true
  },
  "scores.$.employeeId": {
    type: String,
    optional: true
  },
  "scores.$.score": {
    type: Number,
    allowedValues: eNPS.allowedScores,
    defaultValue: 0,
    optional: true
  },
  "scores.$.scoreDate": {
    type: Date,
    optional: true
  },
  sendDate: {
    type: Date
  }
});

eNPS.attachSchema(eNPS.schema);

eNPS.helpers({
  getDate() {
    const
      date = this.sendDate,
      year = date.getFullYear(),
      month = date.getMonth,
      day = date.getDate()
    ;

    return {year, month, date} || {};
  }
});