import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import ProfilesCollection from './collection';

/**
 * Define Collection
 */
export const Profiles = new ProfilesCollection('profiles');

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
    type: [String]
  },
  status: {
    type: String
  },
  imageUrl: {
    type: String
  }
});

Profiles.attachSchema(Profiles.schema);
