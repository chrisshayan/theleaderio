import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import IndustriesCollection from './collection';

/**
 * Define config
 */
export const STATUS_ACTIVE = 'ACTIVE';
export const STATUS_INACTIVE = 'DEACTIVE';

/**
 * Define collection
 */
export const Industries = new IndustriesCollection('industries');

/**
 * Collection schema
 */
Industries.schema = new SimpleSchema({
  name: {
    type: String
  },
  order: {
    type: Number,
    optional: true
  },
  status: {
    type: String,
    defaultValue: STATUS_ACTIVE
  }
});

Industries.attachSchema(Industries.schema);

/**
 * Collection helpers
 */
Industries.helpers({
  customHelper() {
    return 11;
  }
});

/**
 * Collection public fields
 */
Industries.publicFields = {
  name: 1,
  order: 1,
  status: 1,
};