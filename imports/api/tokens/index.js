import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import TokensCollections from './collection';

export const Tokens = new TokensCollections('tokens');

Tokens.schema = new SimpleSchema({
  email: {
    type: String
  },
  password: {
    type: String
  }
});

Tokens.attachSchema = Tokens.schema;