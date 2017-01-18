import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import QuestionsCollection from './collections';

export const Questions = new QuestionsCollection('questions');

Questions.publicFields = {
  leaderId: true,
  organizationId: true,
  question: true,
  answer: true,
  tags: true,
  date: true
};

Questions.schema = new SimpleSchema({
  leaderId: {
    type: String
  },
  organizationId: {
    type: String
  },
  employeeId: {
    type: String,
    optional: true
  },
  question: {
    type: String
  },
  answer: {
    type: String,
    optional: true
  },
  tags: {
    type: [Object],
    optional: true
  },
  "tags.$.category_id": {
    type: Number,
    optional: true
  },
  "tags.$.probability": {
    type: String,
    optional: true
  },
  "tags.$.label": {
    type: String,
    optional: true
  },
  date: {
    type: Date
  }
});

Questions.attachSchema(Questions.schema);