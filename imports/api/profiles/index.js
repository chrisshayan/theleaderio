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
    type: String
  },
  lastName: {
    type: String
  },
  industries: {
    type: [String],
    optional: true
  },
  status: {
    type: String
  },
  imageUrl: {
    type: String
  }
});

Profiles.attachSchema(Profiles.schema);
