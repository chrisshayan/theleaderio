import {MetricsJobs} from './collections';
import moment from 'moment';

// job's functions
import {createMetricRequestsJob} from './jobs';

// collections
import {Organizations} from '/imports/api/organizations/index';
import {Employees} from '/imports/api/employees/index';

// constants
const LOG_LEVEL = {
  WARNING: "WARNING",
  CRITICAL: "CRITICAL",
  INFO: "INFO"
};


/**
 * Enqueue metric email requests
 *
 */
const enqueue = (data) => {
  console.log(`enqueue data into message queue`);
  console.log(data);
}

/**
 * Enqueue Metrics Email Request
 * @param job
 * @param cb
 */
const enqueueMetricEmailRequest = function(job, cb) {
  try {
    let jobMessage = "";
    // get data from scheduler
    // metric, leaderId, runDate = moment.now()
    const runDate = moment().format();
    const metricEmailRequestList = [
      {
        metric: 'purpose',
        leaderId: 'FtnQNEttMb3jMGCJH',
        runDate
      }
    ];

    if(_.isEmpty(metricEmailRequestList)) {
      jobMessage = `No request for today: ${runDate}`;
      job.log(jobMessage, {level: LOG_LEVEL.INFO});
      job.done();
    } else {
      metricEmailRequestList.map(requests => {
        const {metric, leaderId, runDate} = requests;
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
                  employeeName: `${employee.firstName} ${employee.lastName}`,
                  employeeEmail: employee.email,
                  leaderId,
                  organizationId: org._id,
                  metric,
                  runDate
                };
                if(!_.isEmpty(queueData)) {
                  enqueue(queueData); // should have call back
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

const startMetricsRequestsJob = () => {
  MetricsJobs.processJobs('metricsRequests', enqueueMetricEmailRequest)
};


export const workers = {
  metricsRequests: {
    start: startMetricsRequestsJob,
    stop: () => null,
  }
};