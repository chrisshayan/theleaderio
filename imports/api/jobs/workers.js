import {Mongo} from 'meteor/mongo';
import moment from 'moment';
import _ from 'lodash';

// job collections
import {DailyJobs, QueueJobs, AdminJobs} from './collections';

// collections
import {Organizations} from '/imports/api/organizations/index';
import {Employees} from '/imports/api/employees/index';

// methods
import {enqueue} from '/imports/api/message_queue/methods';
import * as EmailActions from '/imports/api/email/methods';
import {getSendingPlans} from '/imports/api/sending_plans/methods';
import {getLocalDate} from '/imports/api/time/functions';
import {setStatus as setSendingPlanStatus} from '/imports/api/sending_plans/methods';
import {measureMonthlyMetricScore} from '/imports/api/measures/methods';
import {add as addMessages} from '/imports/api/user_messages/methods';

// functions
import {migrate} from '/imports/api/migration/functions';
import {getRandomEmployee} from '/imports/api/organizations/functions';

// logger
import {Logger} from '/imports/api/logger/index';

// constants
export const LOG_LEVEL = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  CRITICAL: "danger"
};
import {STATUS_ACTIVE} from '/imports/api/employees/index';
import {STATUS, TYPE} from '/imports/api/user_messages/index';

/**
 * Enqueue Metrics Email Survey
 * @param job
 * @param cb
 */
const enqueueSurveys = function (job, cb) {
  try {
    let jobMessage = "";
    const
      {type} = job.data,
      date = new Date(),
      sendingPlansList = getSendingPlans.call({date})
      ;

    if (_.isEmpty(sendingPlansList)) {
      jobMessage = `No request for today: ${date}`;
      job.log(jobMessage, {level: LOG_LEVEL.INFO});
      job.done();
    } else {
      sendingPlansList.map(sendingPlans => {
        const
          {metric, leaderId, sendDate, timezone} = sendingPlans,
          planId = sendingPlans._id,
          selector = {leaderId, isPresent: true, status: STATUS_ACTIVE},
          organizationList = Organizations.find(selector).fetch()
          ;
        if (_.isEmpty(organizationList)) {
          jobMessage = `Organizations of leader ${leaderId} not found`;
          job.log(jobMessage, {level: LOG_LEVEL.WARNING});
          setSendingPlanStatus.call({_id: planId, status: "FAILED"});
          addMessages.call({
            userId: leaderId,
            type: TYPE.SURVEY,
            message: {
              name: `${metric} Management Survey `,
              detail: "failed because of no organization found."
            },
            status: STATUS.UNREAD,
            date: date
          });
        } else {
          organizationList.map(org => {
            const employeeList = org.employees;
            let noOfEmployeesQueued = 0;
            if (_.isEmpty(employeeList)) {
              jobMessage = `Organization ${org.name} has no employee`;
              job.log(jobMessage, {level: LOG_LEVEL.WARNING});
              setSendingPlanStatus.call({_id: planId, status: "FAILED"});
              addMessages.call({
                userId: leaderId,
                type: TYPE.SURVEY,
                message: {
                  name: `${metric} Management Survey in ${org.name} `,
                  detail: `don't have employee to send.`
                },
                status: STATUS.UNREAD,
                date: date
              });
            } else {
              // get enqueue data
              // name, email, metric, schedulerId
              employeeList.map(employeeId => {
                const employee = Employees.findOne({_id: employeeId, status: STATUS_ACTIVE});
                if (!_.isEmpty(employee)) {
                  const queueData = {
                    planId,
                    employeeId,
                    leaderId,
                    organizationId: org._id,
                    metric: metric.toLowerCase(),
                    date: sendDate,
                    timezone
                  };
                  const attributes = {
                    priority: "normal",
                    after: new Date(getLocalDate(sendDate, timezone))
                  };
                  enqueue.call({type: "send_surveys", attributes, data: queueData}, (error) => {
                    if (_.isEmpty(error)) {
                      noOfEmployeesQueued += 1;
                      setSendingPlanStatus.call({_id: planId, status: "QUEUED"});
                      jobMessage = `Enqueue mail ${metric} to ${employee.email} on ${date}`;
                      job.log(jobMessage, {level: LOG_LEVEL.INFO});
                    } else {
                      jobMessage = `Enqueue mail ${metric} to ${employee.email} on ${date} has error: ${error.reason}`;
                      job.log(jobMessage, {level: LOG_LEVEL.WARNING});
                    }
                  });
                }
              });
              addMessages.call({
                userId: leaderId,
                type: TYPE.SURVEY,
                message: {
                  name: `${metric} Management Survey in ${org.name} `,
                  detail: `sent to ${noOfEmployeesQueued} employees.`
                },
                status: STATUS.UNREAD,
                date: date
              });
            }

          });
        }
      });
      job.done();
    }
  } catch (error) {
    job.fail("" + error);
  }
  // Be sure to invoke the callback
  // when work on this job has finished
  cb();
}

/**
 * Enqueue Metrics Email Survey
 * @param job
 * @param cb
 */
const sendSurveys = function (job, cb) {
  try {
    const {planId, employeeId, leaderId, organizationId, metric} = job.data;
    let jobMessage = "";
    if (_.isEmpty(job.data)) {
      jobMessage = `No data to send Survey Email for job: ${job}`;
      job.log(jobMessage, {level: LOG_LEVEL.WARNING});
      job.done();
    } else {
      const template = 'survey';
      const data = {
        planId,
        employeeId,
        leaderId,
        organizationId,
        metric
      };
      EmailActions.send.call({template, data}, (error) => {
        if (_.isEmpty(error)) {
          setSendingPlanStatus.call({_id: planId, status: "SENT"});
          job.done();
        } else {
          console.log(error)
          setSendingPlanStatus.call({_id: planId, status: "FAILED"});
          jobMessage = error.reason;
          job.log(jobMessage, {level: LOG_LEVEL.WARNING});
          job.done();
        }
      });
    }
  } catch (error) {
    job.log(error, {level: LOG_LEVEL.CRITICAL});
    job.fail();
  }

}

/**
 * Function measure the score of metric for leaders
 * @param job
 * @param cb
 */
const measureMetrics = (job, cb) => {
  measureMonthlyMetricScore.call({params: {}}, (error, measure) => {
    if (!error) {
      if (!_.isEmpty(measure)) {
        jobMessage = `measured metrics for ${measure.noOfLeader} leaders and ${measure.noOfOrg} organizations done`;
        job.log(jobMessage, {level: LOG_LEVEL.INFO});
        job.done();
      } else {
        jobMessage = `No data to measure for job: ${job}`;
        job.log(jobMessage, {level: LOG_LEVEL.WARNING});
        job.done();
      }
    } else {
      job.log(error.reason, {level: LOG_LEVEL.CRITICAL});
      job.fail();
    }
  });
}

/**
 * Function migrate data for users from old version to the new version of theleader.io
 * @param job
 * @param cb
 */
const migrateUsers = (job, cb) => {
  const result = migrate();
  job.log(`migrated ${result} users`, {level: LOG_LEVEL.INFO});
  job.done();
}

/**
 * Function send email to leader to receive feedback for an employee who will be choose randomly
 * @param job
 * @param cb
 */
export const sendFeedbackEmailToLeader = (job, cb) => {
  const
    name = "sendFeedbackEmailToLeader",
    activeOrgList = Organizations.find({isPresent: true}, {fields: {_id: true}}).fetch()
    ;
  let
    employee = {},
    employeeData = {}

  if (_.isEmpty(activeOrgList)) {
    job.log({name, message: "No active organization"});
    job.done();
  } else {
    activeOrgList.map(org => {
      const
        employee = getRandomEmployee({params: {organizationId: org._id}})
        ;
      if (!_.isEmpty(employee)) {
        if (employee.message === 'undefined') {
          Logger.error({name, message: {detail: employee.message}});
        } else {
          employeeData = Employees.findOne({_id: employee.employeeId});
          if (!_.isEmpty(employeeData)) {
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
                job.log(`Send email to leader ${employeeData.leaderId} about employee ${employeeData._id} - success`);
              } else {
                job.log(`Send email to leader ${employeeData.leaderId} about employee ${employeeData._id} - failed`);
              }
            });
          } else {
            job.log(`Employee ${employee.employeeId} not exists`);
          }
        }
      }
    });
    job.done();
  }
}

// Start Job
function startJob(type) {
  switch (type) {
    // daily jobs
    case "enqueue_surveys": {
      DailyJobs.processJobs(type, enqueueSurveys);
    }
    case "measure_metric": {
      DailyJobs.processJobs(type, measureMetrics);
    }
    // queue jobs
    case "send_surveys": {
      QueueJobs.processJobs(type, sendSurveys);
    }
    // queue jobs
    case "migration": {
      QueueJobs.processJobs(type, migrateUsers);
    }
    // admin jobs: send feedback email for employee
    case "feedback_for_employee": {
      AdminJobs.processJobs(type, sendFeedbackEmailToLeader);
    }
  }
}

// Stop Job
function stopJob() {

}

// Restart Job
function restartJob() {

}

// workers
export const Workers = {
  start: startJob,
  stop: stopJob,
  restart: restartJob
};