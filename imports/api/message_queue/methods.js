import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// collections
import {QueueCollection} from '/imports/api/message_queue/index';

/**
 *  Enqueue methods
 *  params: date, data
 */
// solution for enqueueing sending metric email message on different timezones
// enqueue with job-collection:
//  const sendDate = getLocalDate(date, timezone);
//  const job = new Job(queue);
//  job.after(sendDate).save();
//
// enqueue with rabbitMQ:
//  const jobRunDate = "2016-08-15 09:00" // in local timezone (the running time of job)
//  const sendDate = getLocalDate(date, timezone); // get send date in local timezone
//  const delayTime = jobRunDate.diff(sendDate);
//  enqueue into rabbitMQ with x-delay(delayTime)

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