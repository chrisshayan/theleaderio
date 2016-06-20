import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { LeadershipsCollection } from './collection';

/**
 * Collection
 */
export const Leaderships = new LeadershipsCollection('leaderships');

/**
 * Schema
 */
Leaderships.schema = new SimpleSchema({
  leaderId: {
    type: String
  },
  "organizations.$.organizationId": {
    type: String  // _id mapped from collection organizations
  },
  "organizations.$.employees": {
    type: [String]  // list of employeeId mapped from collection employees
  },
  "organizations.$.startDate": {
    type: Date,
    optional: true
  },
  "organizations.$.endDate": {
    type: Date,
    optional: true
  }
});

Leaderships.attachSchema(Leaderships.schema);
