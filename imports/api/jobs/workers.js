import {MetricsJobs} from './collections';
import moment from 'moment';

// collections
import {Organizations} from '/imports/api/organizations/index';
import {Employees} from '/imports/api/employees/index';

// methods
import {enqueue} from '/imports/api/message_queue/methods';

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
const enqueueMetricEmailSurvey = function(job, cb) {
  try {
    let jobMessage = "";
    // get data from scheduler
    // metric, leaderId, runDate = moment.now()
    const runDate = new Date();
    const metricEmailSurveyList = [
      {
        metric: 'purpose',
        leaderId: 'FtnQNEttMb3jMGCJH',
        runDate
      }
    ];

    if(_.isEmpty(metricEmailSurveyList)) {
      jobMessage = `No request for today: ${runDate}`;
      job.log(jobMessage, {level: LOG_LEVEL.INFO});
      job.done();
    } else {
      metricEmailSurveyList.map(surveys => {
        const {metric, leaderId, runDate} = surveys;
        const selector = {leaderId, isPresent: true};
        const organizationList = Organizations.find(selector).fetch();
        if(_.isEmpty(organizationList)) {
          jobMessage = `Organizations of leader ${leaderId} not found`;
          job.log(jobMessage, {level: LOG_LEVEL.WARNING});
        } else {
          organizationList.map(org => {
            const employeeList = org.employees;
            if(_.isEmpty(employeeList)) {
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
                  metric
                };
                if(!_.isEmpty(queueData)) {
                  enqueue.call({date: runDate, data: queueData}, (error) => {
                    if(_.isEmpty(error)) {
                      jobMessage = `Enqueue mail ${metric} to ${employee.email} on ${runDate}`;
                      job.log(jobMessage, {level: LOG_LEVEL.INFO});
                    } else {
                      jobMessage = `Enqueue mail ${metric} to ${employee.email} on ${runDate} has error: ${error.reason}`;
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
  } catch(error) {
    job.fail("" + error);
  }
  // Be sure to invoke the callback
  // when work on this job has finished
  cb();
}

const startMetricsSurveysJob = () => {
  MetricsJobs.processJobs('metricsRequests', enqueueMetricEmailSurvey)
};


export const workers = {
  metricsSurveys: {
    start: startMetricsSurveysJob,
    stop: () => null,
  }
};