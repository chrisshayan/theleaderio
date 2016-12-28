import {AliasesCollection} from './collections';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';


export const Aliases = new AliasesCollection('aliases');

Aliases.schema = new SimpleSchema({
  alias: {
    type: String
  }
});

Aliases.attachSchema(Aliases.schema);
