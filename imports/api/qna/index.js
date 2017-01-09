import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import QNACollection from './collections';

export const QNA = new QNACollection('questions_and_answers');

QNA.publicFields = {};

QNA.schema = new SimpleSchema({
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
  date: {
    type: Date
  }
});

QNA.attachSchema(QNA.schema);