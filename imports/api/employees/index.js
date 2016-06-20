import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import EmployeesCollection from './collection';

/**
 * Constant
 */
export const STATUS_ACTIVE = 'ACTIVE';
export const STATUS_DEACTIVE = 'DEACTIVE';

/**
 * Collection
 */
export const Employees = new EmployeesCollection('employees');

/**
 * Schema
 */
Employees.schema = new SimpleSchema({
  email: {
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
    type: String,
    allowedValues: [ STATUS_ACTIVE, STATUS_DEACTIVE ]
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

Employees.attachSchema(Employees.schema);