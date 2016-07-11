import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import OrganizationsCollection from './collection';

/**
 * Constant
 */
export const STATUS_ACTIVE = 'ACTIVE';
export const STATUS_INACTIVE = 'DEACTIVE';

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
    allowedValues: [ STATUS_ACTIVE, STATUS_INACTIVE ],
    defaultValue: STATUS_ACTIVE
  },
  description: {
    type: String,
    optional: true
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
  }
});

Organizations.attachSchema(Organizations.schema);


/**
 * Public fields
 */

Organizations.publicFields = {
  name: 1,
  status: 1,
  description: 1,
  industries: 1,
};