import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import OrganizationsCollection from './collection';

/**
 * Constant
 */
export const STATUS_ACTIVE = 'ACTIVE';
export const STATUS_DEACTIVE = 'DEACTIVE';

/**
 * Collection
 */
export const Organizations = new OrganizationsCollection('organizations');

/**
 * Schema
 */
Organizations.schema = new SimpleSchema({
  name: {
    type: String
  },
  industries: {
    type: [String],
    optional: true
  },
  status: {
    type: String,
    allowedValues: [ STATUS_ACTIVE, STATUS_DEACTIVE ]
  },
  catchPhrase: {
    type: String,
    optional: true
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
  }
});

Organizations.attachSchema(Organizations.schema);
