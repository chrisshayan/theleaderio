import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// collections
import ArticlesCollection from './collections';

export const Articles = new ArticlesCollection('articles');

// CONSTANTS
const STATUS = {
  ACTIVE: "ACTIVE",
  DRAFT: "DRAFT",
  DELETED: "DELETED"
};

Articles.schema = new SimpleSchema({
  leaderId: {
    type: String,
    optional: true
  },
  subject: {
    type: String
  },
  seoUrl: {
    type: String,
    optional: true
  },
  description: {
    type: String,
    optional: true
  },
  content: {
    type: String
  },
  tags: {
    type: [String],
    optional: true
  },
  likes: {
    type: [String],
    defaultValue: []
  },
  status: {
    type: String,
    allowedValues: [STATUS.ACTIVE, STATUS.DRAFT, STATUS.DELETED],
    defaultValue: STATUS.ACTIVE
  },
  updatedAt: {
    type: Date,
    optional: true
  },
  createdAt: {
    type: Date,
    optional: true
  }
});