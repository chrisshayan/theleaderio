import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import ProfilesCollection from './collection';

/**
 * Constant
 */
export const STATUS_ACTIVE = 'ACTIVE';
export const STATUS_DEACTIVE = 'DEACTIVE';

/**
 * Collection
 */
export const Profiles = new ProfilesCollection('profiles');

/**
 * Schema
 */
Profiles.schema = new SimpleSchema({
  userId: {
    type: String
  },
  alias: {
    type: String
  },
  firstName: {
    type: String,
    optional: true
  },
  lastName: {
    type: String,
    optional: true
  },
  industries: {
    type: [String],
    optional: true
  },
  status: {
    type: String
  },
  imageUrl: {
    type: String,
    optional: true
  },
  "address.zipCode": {
    type: String,
    optional: true
  },
  "address.countryCode": {
    type: String,
    optional: true
  },
  "address.country": {
    type: String,
    optional: true
  },
  "address.city": {
    type: String,
    optional: true
  },
  "address.district": {
    type: String,
    optional: true
  },
  "address.streetName": {
    type: String,
    optional: true
  },
  "address.streetAddress": {
    type: String,
    optional: true
  },
  "address.secondaryAddress": {
    type: String,
    optional: true
  },
  "address.geo.latitude": {
    type: String,
    optional: true
  },
  "address.geo.longitude": {
    type: String,
    optional: true
  },
  phoneNumber: {
    type: String,
    optional: true
  }
});

Profiles.attachSchema(Profiles.schema);
