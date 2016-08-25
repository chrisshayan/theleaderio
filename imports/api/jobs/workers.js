import {DailyJobs, QueueJobs} from './collections';
import {words as capitalize} from 'capitalize';

// collections
import {Organizations} from '/imports/api/organizations/index';
import {Employees} from '/imports/api/employees/index';

// methods
import {enqueue} from '/imports/api/message_queue/methods';
import * as EmailActions from '/imports/api/email/methods';
import {getSendingPlans} from '/imports/api/sending_plans/methods';
import {getLocalDate} from '/imports/api/time/functions';



// constants
const LOG_LEVEL = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  CRITICAL: "danger"
};
import {STATUS_ACTIVE} from '/imports/api/employees/index';

/**
 * Enqueue Metrics Email Survey
 * @param job
 * @param cb
 */
const enqueueSurveys = function (job, cb) {
  try {
    let jobMessage = "";
    const {type} = job.data;
    // get data from scheduler
    // metric, leaderId, date = moment.now()
    // example data which date will be next 2 minutes
    // const date = new Date(moment().add(2, 'minutes').format());
    const date = new Date();
    const sendingPlansList = getSendingPlans.call({date});
    console.log(`run job`);
    console.log(sendingPlansList)

    if (_.isEmpty(sendingPlansList)) {
      jobMessage = `No request for today: ${date}`;
      job.log(jobMessage, {level: LOG_LEVEL.INFO});
      job.done();
    } else {
      sendingPlansList.map(sendingPlans => {
        const {metric, leaderId, sendDate, timezone} = sendingPlans;
        const planId = sendingPlans._id;
        const selector = {leaderId, isPresent: true, status: STATUS_ACTIVE};
        const organizationList = Organizations.find(selector).fetch();
        if (_.isEmpty(organizationList)) {
          jobMessage = `Organizations of leader ${leaderId} not found`;
          job.log(jobMessage, {level: LOG_LEVEL.WARNING});
        } else {
          organizationList.map(org => {
            const employeeList = org.employees;
            if (_.isEmpty(employeeList)) {
              jobMessage = `Organization ${org.name} has no employee`;
              job.log(jobMessage, {level: LOG_LEVEL.WARNING});
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
                    metric: capitalize(metric.toLowerCase()),
                    date: sendDate,
                    timezone
                  };
                  const attributes = {
                    priority: "normal",
                    after: new Date(getLocalDate(date, timezone))
                  };
                  enqueue.call({type: "send_surveys", attributes, data: queueData}, (error) => {
                    if (_.isEmpty(error)) {
                      jobMessage = `Enqueue mail ${metric} to ${employee.email} on ${date}`;
                      job.log(jobMessage, {level: LOG_LEVEL.INFO});
                    } else {
                      jobMessage = `Enqueue mail ${metric} to ${employee.email} on ${date} has error: ${error.reason}`;
                      job.log(jobMessage, {level: LOG_LEVEL.WARNING});
                    }
                  });
                }
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
      // console.log({employeeId, leaderId, organizationId, metric});
      const template = 'survey';
      const data = {
        planId,
        employeeId,
        leaderId,
        organizationId,
        metric
      };
      EmailActions.send.call({template, data}, (error) => {
        if(_.isEmpty(error)) {
          console.log(`update status of plan to SENT`);
          job.done();
        } else {
          console.log(`update status of plan to FAILED`);
          console.log(error);
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

// Start Job
function startJob(type) {
  switch(type) {
    case "enqueue_surveys": {
      DailyJobs.processJobs(type, enqueueSurveys);
    }
    case "send_surveys": {
      QueueJobs.processJobs(type, sendSurveys);
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