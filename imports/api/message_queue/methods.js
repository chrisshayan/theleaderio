import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// collections
import {QueueCollection} from '/imports/api/message_queue/index';

/**
 *  Enqueue methods
 *  params: date, data
 */

export const enqueue = new ValidatedMethod({
  name: 'mq.enqueue',
  validate: null,
  run({date, data}) {
    if(!this.isSimulation) {
      QueueCollection.insert({date, data});
    }
  }
});

/**
 * Dequeue methods
 * params: no
 */
export const dequeue = new ValidatedMethod({
  name: 'mq.dequeue',
  validate: null,
  run() {
    const emailList = QueueCollection.find({}).fetch();
    console.log(emailList);
  }
});