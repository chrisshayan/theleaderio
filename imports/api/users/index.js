import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// collections
import PreferencesCollection from './collection';

export const Preferences = new PreferencesCollection('preferences');
