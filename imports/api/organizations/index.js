import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { FlowRouter } from 'meteor/kadira:flow-router';
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
  owner: {
    type: String,
    optional: true,
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
  owner: 1,
  createdAt: 1,
  updatedAt: 1
};

/**
 * Organization helpers
 */
Organizations.helpers({
  editUrl() {
    return FlowRouter.url('app.organizations.update', {_id: this._id});
  }
});