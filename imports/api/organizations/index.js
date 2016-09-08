import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { FlowRouter } from 'meteor/kadira:flow-router';
import OrganizationsCollection from './collection';
import { DEFAULT_ORGANIZATION_PHOTO } from '/imports/utils/defaults';

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
  jobTitle: {
    type: String,
    optional: true,
  },
  industries: {
    type: [String],
    optional: true
  },
  status: {
    type: String,
    allowedValues: [ STATUS_ACTIVE, STATUS_INACTIVE ],
    defaultValue: STATUS_ACTIVE,
    optional: true
  },
  description: {
    type: String,
    optional: true
  },
  imageUrl: {
    type: String,
    optional: true
  },
  startTime: {
    type: Date,
    optional: true,
  },
  endTime: {
    type: Date,
    optional: true,
  },
  isPresent: {
    type: Boolean,
    defaultValue: false,
    optional: true,
  },
  createdAt: {
    type: Date,
    optional: true,
  },
  updatedAt: {
    type: Date,
    optional: true,
  },
  leaderId: {
    type: String,
    optional: true,
  },
  employees: {
    type: [String],
    optional: true,
    defaultValue: []
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
  startTime: 1,
  endTime: 1,
  isPresent: 1,
  leaderId: 1,
  createdAt: 1,
  updatedAt: 1,
  employees: 1,
  jobTitle: 1,
  imageUrl: 1,
};

/**
 * Organization helpers
 */
Organizations.helpers({
  editUrl() {
    return FlowRouter.url('app.organizations.update', {_id: this._id});
  },

  picture() {
    return this.imageUrl || DEFAULT_ORGANIZATION_PHOTO;
  },

  noEmployees() {
    return this.employees.length;
  }
});