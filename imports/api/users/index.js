import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// collections
import PreferencesCollection from './collection';

export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  INACTIVE: "inactive"
};

export const Preferences = new PreferencesCollection('preferences');