import {ValidatedMethod} from 'meteor/mdg:validated-method';

// collections
import {Measures} from './index';

// export const add = new ValidatedMethod({
//   name: "measures.add",
//   validate: null,
//   run({leaderId, organizationId, type, interval, data}) {
//     Measures.insert({leaderId, organizationId, type, interval, data});
//   }
// });
//
// export const edit = new ValidatedMethod({
//   name: "measures.edit",
//   validate: null,
//   run({_id, data}) {
//     Measures.update({_id}, {$set: {data}});
//   }
// });