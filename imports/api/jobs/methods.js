import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {later} from 'meteor/mrt:later';

// Job Collection
import {AdminJobs} from '/imports/api/jobs/collections';

// Job
import {Jobs} from '/imports/api/jobs/jobs';

// functions
// import {sendFeedbackEmailToLeader} from '/imports/api/jobs/functions';

// constants
import * as ERROR_CODE from '/imports/utils/error_code';

// Job Collection
// import {AdminJobs} from '/imports/api/jobs/collections';

// collections
import {Organizations} from '/imports/api/organizations/index';
import {Employees} from '/imports/api/employees/index';

// Job
// import {Jobs} from '/imports/api/jobs/jobs';

// methods
import * as EmailActions from '/imports/api/email/methods';

// functions
import {getRandomEmployee} from '/imports/api/organizations/functions';


/**
 * Function send email to leader to receive feedback for an employee who will be choose randomly
 * @param job
 * @param cb
 */
const sendFeedbackEmailToLeader = function(job, cb) {
  const
    name = "sendFeedbackEmailToLeader",
    activeOrgList = Organizations.find({isPresent: true}, {fields: {_id: true}}).fetch()
    ;
  let
    employee = {},
    employeeData = {},
    jobMessage = ""

  if(_.isEmpty(activeOrgList)) {
    job.log({name, message: "No active organization"});
    job.done();
  } else {
    activeOrgList.map(org => {
      const
        employee = getRandomEmployee({params: {organizationId: org._id}})
        ;
      if(!_.isEmpty(employee)) {
        if(employee.message === 'undefined') {
          Logger.error({name, message: {detail: employee.message}});
        } else {
          employeeData = Employees.findOne({_id: employee.employeeId});
          if(!_.isEmpty(employeeData)) {
            const
              template = 'employee',
              data = {
                type: "feedback",
                employeeId: employeeData._id,
                leaderId: employeeData.leaderId,
                organizationId: employeeData.organizationId
              };
            EmailActions.send.call({template, data}, (error) => {
              if (_.isEmpty(error)) {
                jobMessage = `Send email to leader ${employeeData.leaderId} about employee ${employeeData._id} - success`;
                job.log(jobMessage, {level: LOG_LEVEL.INFO});
              } else {
                jobMessage = `Send email to leader ${employeeData.leaderId} about employee ${employeeData._id} - failed`;
                job.log(jobMessage, {level: LOG_LEVEL.CRITICAL});
              }
            });
          } else {
            jobMessage = `Employee ${employee.employeeId} not exists`;
            job.log(jobMessage, {level: LOG_LEVEL.WARNING});
          }
        }
      }
    });
    job.done();
  }
}

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

      console.log(schedule)
      // get current job
      jobs = AdminJobs.find({type, status: {$in: AdminJobs.jobStatusCancellable}}, {fields: {_id: true, status: true}}).fetch();
      if(_.isEmpty(jobs)) {
        message = Jobs.create(type, attributes, data);
        AdminJobs.processJobs(type, sendFeedbackEmailToLeader);
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
              AdminJobs.processJobs(type, sendFeedbackEmailToLeader);
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

