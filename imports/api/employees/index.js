import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import EmployeesCollection from './collection';

/**
 * Constant
 */
export const STATUS_ACTIVE = 'ACTIVE';
export const STATUS_INACTIVE = 'DEACTIVE';

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
    allowedValues: [ STATUS_ACTIVE, STATUS_INACTIVE ],
    defaultValue: STATUS_ACTIVE
  },
  imageUrl: {
    type: String,
    optional: true
  }
});

Employees.attachSchema(Employees.schema);
