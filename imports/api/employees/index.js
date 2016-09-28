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
    type: String
  },
  lastName: {
    type: String,
    optional: true
  },
  status: {
    type: String,
    allowedValues: [ STATUS_ACTIVE, STATUS_DEACTIVE ],
    defaultValue: STATUS_ACTIVE
  },
  imageUrl: {
    type: String,
    optional: true
  },
  organizationId: {
    type: String
  },
  leaderId: {
    type: String
  }
});

Employees.attachSchema(Employees.schema);

/**
 * Helpers
 */
Employees.helpers({
  fullname() {
    return [this.lastName, this.firstName].join(' ');
  },

  firstLetter() {
    return this.firstName ? this.firstName[0] : '';
  }
})
