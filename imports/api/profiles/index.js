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
  zipCode: {
    type: Number,
    optional: true
  },
  country: {
    type: String,
    optional: true
  },
  city: {
    type: String,
    optional: true
  },
  streetName: {
    type: String,
    optional: true
  },
  streetAddress: {
    type: String,
    optional: true
  },
  phoneNumber: {
    type: String,
    optional: true
  }
});

Profiles.attachSchema(Profiles.schema);
