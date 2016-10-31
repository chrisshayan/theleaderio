import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// collection
import ReferralsCollection from './collections';

// constants
export const STATUS = {
  WAITING: "WAITING",
  INVITED: "INVITED",
  CONFIRMED: "CONFIRMED"
};

export const Referrals = new ReferralsCollection("referrals");

Referrals.schema = new SimpleSchema({
  leaderId: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
    optional: true,
  },
  status: {
    type: String,
    optional: true,
    allowedValues: [STATUS.INVITED, STATUS.CONFIRMED],
    defaultValue: STATUS.WAITING
  },
  createdAt: {
    type: Date,
    optional: true
  },
  updatedAt: {
    type: Date,
    optional: true
  }
});

Referrals.attachSchema(Referrals.schema);