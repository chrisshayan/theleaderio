import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { LeadershipsCollection } from './collection';

/**
 * Collection
 */
export const Leaderships = new LeadershipsCollection('leaderships');

/**
 * Schema
 */
const maxOrg = 10; // allow leader to have maximum 4 organizations only
Leaderships.schema = new SimpleSchema({
  leaderId: {
    type: String
  },
  organizations: {
    type: [Object],
    maxCount: maxOrg  // allow leader to have only
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
