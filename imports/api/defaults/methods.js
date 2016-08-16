import {ValidatedMethod} from 'meteor/mdg:validated-method';

// collections
import {Defaults} from './index';

export const add = new ValidatedMethod({
  name: "defaults.add",
  validate: null,
  run({name, content}) {
    Defaults.insert({name, content});
  }
});

export const remove = new ValidatedMethod({
  name: "defaults.remove",
  validate: null,
  run({id, name}) {
    if(!!id) {
      Defaults.remove({_id: id});
    }
    if(!!name) {
      Defaults.remove({name: name});
    }
  }
});

export const get = new ValidatedMethod({
  name: "defaults.get",
  validate: null,
  run({name}) {
    const selector = {name};
    return Defaults.findOne(selector);
  }
});