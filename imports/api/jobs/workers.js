import {MetricsJobs, QueueJobs} from './collections';
import moment from 'moment';

// collections
import {Organizations} from '/imports/api/organizations/index';
import {Employees} from '/imports/api/employees/index';
import {SendingPlans} from '/imports/api/sending_plans/index';

// methods
import {enqueue} from '/imports/api/message_queue/methods';
import * as EmailActions from '/imports/api/email/methods';
import {getSendingPlans} from '/imports/api/sending_plans/methods';



// constants
const LOG_LEVEL = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  CRITICAL: "danger"
};

/**
 * Enqueue Metrics Email Survey
 * @param job
 * @param cb
 */
const enqueueMetricEmailSurvey = function (job, cb) {
  try {
    let jobMessage = "";
    // get data from scheduler
    // metric, leaderId, date = moment.now()
    // example data which date will be next 2 minutes
    // const date = new Date(moment().add(2, 'minutes').format());
    const date = new Date(2016, 8, 17);
    const metricEmailSurveyList = getSendingPlans.call({date});
    // const metricEmailSurveyList = [
    //   {
    //     metric: 'mettings',
    //     leaderId: 'FtnQNEttMb3jMGCJH',
    //     date,
    //     timezone: "America/New_York"
    //   }
    // ];
    console.log(`run job`);
    console.log(metricEmailSurveyList)

    if (_.isEmpty(metricEmailSurveyList)) {
      jobMessage = `No request for today: ${date}`;
      job.log(jobMessage, {level: LOG_LEVEL.INFO});
      job.done();
    } else {
      metricEmailSurveyList.map(surveys => {
        const {metric, leaderId, sendDate, timezone} = surveys;
        const selector = {leaderId, isPresent: true};
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
                const employee = Employees.findOne({_id: employeeId});
                const queueData = {
                  employeeId,
                  leaderId,
                  organizationId: org._id,
                  metric,
                  date: sendDate,
                  timezone
                };
                if (!_.isEmpty(queueData)) {
                  enqueue.call({data: queueData}, (error) => {
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
const sendSurveyEmail = function (job, cb) {
  try {
    const {employeeId, leaderId, organizationId, metric} = job.data;
    let jobMessage = "";
    if (_.isEmpty(job.data)) {
      jobMessage = `No data to send Survey Email for job: ${job}`;
      job.log(jobMessage, {level: LOG_LEVEL.WARNING});
      job.done();
    } else {
      // console.log({employeeId, leaderId, organizationId, metric});
      const template = 'survey';
      const data = {
        employeeId,
        leaderId,
        organizationId,
        metric
      };
      EmailActions.send.call({template, data}, (error) => {
        if(_.isEmpty(error)) {
          job.done();
        } else {
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

// Metrics Surveys Job
const startMetricsSurveysJob = () => {
  MetricsJobs.processJobs('metricsSurveys', enqueueMetricEmailSurvey);
};
const stopMetricsSurveysJob = () => {
  MetricsJobs.processJobs('metricsSurveys', enqueueMetricEmailSurvey);
};

// Send Surveys Job
const startSendSurveysJob = () => {
  QueueJobs.processJobs('sendSurveyEmail', sendSurveyEmail);
}
const stopSendSurveysJob = () => {
  QueueJobs.processJobs('sendSurveyEmail', sendSurveyEmail);
}

// workers
export const workers = {
  metricsSurveys: {
    start: startMetricsSurveysJob,
    stop: stopMetricsSurveysJob,
  },
  sendSurveys: {
    start: startSendSurveysJob,
    stop: stopSendSurveysJob,
  }
};