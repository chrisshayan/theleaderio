import {ValidatedMethod} from 'meteor/mdg:validated-method';

// collections
import {Articles} from './index';

export const add = new ValidatedMethod({
  name: "articles.add",
  validate: null,
  run({subject, content, tags}) {
    return Articles.insert({subject, content, tags});
  }
});

