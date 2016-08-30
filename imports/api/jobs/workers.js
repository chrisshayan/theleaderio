import {Mongo} from 'meteor/mongo';
import {DailyJobs, QueueJobs} from './collections';
import moment from 'moment';
import _ from 'lodash';

// collections
import {Organizations} from '/imports/api/organizations/index';
import {Employees} from '/imports/api/employees/index';
import {Metrics} from '/imports/api/metrics/index';

// methods
import {enqueue} from '/imports/api/message_queue/methods';
import * as EmailActions from '/imports/api/email/methods';
import {getSendingPlans} from '/imports/api/sending_plans/methods';
import {getLocalDate} from '/imports/api/time/functions';
import {setStatus as setSendingPlanStatus} from '/imports/api/sending_plans/methods';

// functions
import {measure} from '/imports/api/measures/functions';
import {arraySum} from '/imports/utils/index';

// constants
const LOG_LEVEL = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  CRITICAL: "danger"
};
import {STATUS_ACTIVE} from '/imports/api/employees/index';
import {DEFAULT_METRICS} from '/imports/utils/defaults';

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
                    metric: metric.toLowerCase(),
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
        if (_.isEmpty(error)) {
          setSendingPlanStatus.call({_id: planId, status: "SENT"});
          job.done();
        } else {
          setSendingPlanStatus.call({_id: planId, status: "FAILED"});
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

const measureMetrics = (job, cb) => {
  try {
    // create mini mongo collection
    const MiniMongo = new Mongo.Collection(null);
    MiniMongo.remove({});
    const
    // {} = job.data,
      runDate = new Date(),
      year = runDate.getFullYear(),
      month = runDate.getMonth(),
      nextMonth = month + 1
      ;
    let
      jobMessage = "",
      selector = {},
      modifier = {},
      leaderList = [],
      result = false
      ;

    // Get list of leaders
    selector = {
      date: {
        $gte: new Date(year, month, 1),
        $lt: new Date(year, nextMonth, 1)
      }
    }; // only get data in current month
    modifier = {
      fields: {
        _id: 0,
        leaderId: 1,
        organizationId: 1,
        metric: 1,
        score: 1
      }
    }; // only return necessary fields

    // get leaders data in current month
    const docs = Metrics.find(selector, modifier).fetch();
    if(!_.isEmpty(docs)) {

      docs.map(doc => {
        MiniMongo.insert(doc);
        leaderList.push(doc.leaderId);
      });
      leaderList = _.uniq(leaderList); // get unique leader only

      // get average score for every leader
      leaderList.map(leaderId => {
        var orgList = [];
        var leaderDocs = MiniMongo.find({leaderId}).fetch();

        //get list of organization for specific leader
        leaderDocs.map(leaderDoc => {
          orgList.push(leaderDoc.organizationId);
          orgList = _.uniq(orgList);
        });
        // get list of metric for specific organization
        orgList.map(organizationId => {
          var metricList = [];
          var orgDocs = MiniMongo.find({leaderId, organizationId}).fetch();
          // console.log(MiniMongo.find().fetch());
          orgDocs.map(orgDoc => {
            metricList.push(orgDoc.metric);
            metricList = _.uniq(metricList);
          });
          // get list of score for specific metric
          metricList.map(metric => {
            var scoreList = [];
            var measureDoc = {}; // data of measure for leader
            var metricDocs = MiniMongo.find({leaderId, organizationId, metric}).fetch();
            metricDocs.map(metricDoc => {
              scoreList.push(metricDoc.score);
            });

            // calculate average score of metric
            var averageScore = arraySum(scoreList) / scoreList.length;
            averageScore = Number(averageScore.toFixed(1));

            measureDoc = {
              leaderId,
              organizationId,
              type: "metric",
              interval: "monthly",
              year,
              month,
              key: metric,
              value: averageScore
            };

            measure({data: measureDoc});
          });
        });
      });
      jobMessage = `measured metrics for ${leaderList.length} leaders`;
      job.log(jobMessage, {level: LOG_LEVEL.INFO});
      job.done();
    } else {
      jobMessage = `No data to measure for job: ${job}`;
      job.log(jobMessage, {level: LOG_LEVEL.WARNING});
      job.done();
    }

  } catch (error) {
    job.log(error, {level: LOG_LEVEL.CRITICAL});
    job.fail();
  }
}

// Start Job
function startJob(type) {
  switch (type) {
    // daily jobs
    case "enqueue_surveys":
    {
      DailyJobs.processJobs(type, enqueueSurveys);
    }
    case "measure_metric":
    {
      DailyJobs.processJobs(type, measureMetrics);
    }
    // queue jobs
    case "send_surveys":
    {
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