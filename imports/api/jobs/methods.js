import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {later} from 'meteor/mrt:later';

// Job Collection
import {AdminJobs} from '/imports/api/jobs/collections';

// Job
import {Jobs} from '/imports/api/jobs/jobs';
import {Workers} from '/imports/api/jobs/workers';

// functions
import {isAdmin} from '/imports/utils/index';

// constants
import * as ERROR_CODE from '/imports/utils/error_code';

/**
 * Method create admin job with the configurable repeat (use cron parser of later.js)
 * @param type
 * @param schedule
 * @param data
 * @return result - success, failed
 */
export const createAdminJob = new ValidatedMethod({
  name: "jobs.createAdminJob",
  validate: null,
  run(params) {
    if (!this.isSimulation) {
      const
        {
          type = "",
          schedule = {
            min: 0, // 0 - 59
            hour: 0, // 0 - 23
            dayOfMonth: 1, // 1 - 31
            month: 1, // 1 - 12
            dayOfWeek: 0 // 0 - 6 (0 is Monday, 7 is Sunday too)
          },
          data = {}
        } = params,
        {min, hour, dayOfMonth, month, dayOfWeek} = schedule,
        cronExpression = `${min} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`,
        attributes = {
          priority: "normal",
          repeat: {schedule: later.parse.cron(cronExpression)}
        }
        ;

      // create admin job
      Jobs.create(type, attributes, data);
    }
  }
});


/**
 * Method edit admin job with the configurable repeat (use cron parser of later.js)
 * @param type
 * @param schedule
 * @param data
 * @return result - success, failed
 */
export const editAdminJob = new ValidatedMethod({
  name: "jobs.editAdminJob",
  validate: null,
  run({params}) {
    if (Meteor.isServer) {
      const
        {
          type = "",
          schedule = {
            min: 0, // 0 - 59
            hour: 0, // 0 - 23
            dayOfMonth: 1, // 1 - 31
            month: 1, // 1 - 12
            dayOfWeek: 0 // 0 - 6 (0 is Monday, 7 is Sunday too)
          },
          data = {}
        } = params,
        cronExpression = `${schedule.min} ${schedule.hour} ${schedule.dayOfMonth} ${schedule.month} ${schedule.dayOfWeek}`,
        attributes = {
          priority: "normal",
          repeat: {schedule: later.parse.cron(cronExpression)}
          // repeat: {schedule: later.parse.text("every 5 minutes")} // for testing
        }
        ;
      let
        jobs = {},
        status = false,
        message = ""
      ;

      // get current job
      jobs = AdminJobs.find({type, status: {$in: AdminJobs.jobStatusCancellable}}, {fields: {_id: true, status: true}}).fetch();
      if(_.isEmpty(jobs)) {
        message = Jobs.create(type, attributes, data);
        Workers.start(type);
        return {message}; // return new job id
      } else {
        jobs.map(job => {
          if(job.status === "running") {
            message = "running";
            return {message}; // job running, couldn't update
          } else {
            status = AdminJobs.cancelJobs([job._id]);
            if(status) {
              // cancel job success, create new job with new attributes
              message = Jobs.create(type, attributes, data);
              Workers.start(type);
              return {message}; // return new job id
            } else {
              message = "failed";
              return {message}; // update job failed
            }
          }
        });
      }
    }
  }
});