import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import TokensCollections from './collection';

export const Tokens = new TokensCollections('tokens');

Tokens.schema = new SimpleSchema({
  email: {
    type: String
  },
  password: {
    type: String,
    optional: true
  },
  action: {
    type: String,
    allowedValues: ['email', 'password', 'alias'],
    optional: true
  }
});

Tokens.attachSchema = Tokens.schema;