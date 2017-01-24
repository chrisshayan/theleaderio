import {Mongo} from 'meteor/mongo';
import moment from 'moment';
import _ from 'lodash';
import {Roles} from 'meteor/alanning:roles';

// job collections
import {DailyJobs, QueueJobs, AdminJobs} from './collections';

// collections
import {Accounts} from 'meteor/accounts-base';
import {Organizations} from '/imports/api/organizations/index';
import {Employees, STATUS_ACTIVE} from '/imports/api/employees/index';
import {Profiles} from '/imports/api/profiles/index';

// methods
import {enqueue} from '/imports/api/message_queue/methods';
import * as EmailActions from '/imports/api/email/methods';
import {getSendingPlans} from '/imports/api/sending_plans/methods';
import {getLocalDate} from '/imports/api/time/functions';
import {setStatus as setSendingPlanStatus} from '/imports/api/sending_plans/methods';
import {measureMonthlyMetricScore} from '/imports/api/measures/methods';
import {add as addMessages} from '/imports/api/user_messages/methods';
import {create as createENPS} from '/imports/api/enps/functions';

// functions
import {migrate} from '/imports/api/migration/functions';
import {getRandomEmployee} from '/imports/api/organizations/functions';
import {add as addLogs} from '/imports/api/logs/functions';
import {getAllActiveUsers} from '/imports/api/users/functions';
import {getAllPresentOrganizationOfLeader} from '/imports/api/organizations/functions';
import {getAllActiveEmployeesOfOrganization} from '/imports/api/employees/functions';

// logger
import {Logger} from '/imports/api/logger/index';

// constants
export const LOG_LEVEL = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  CRITICAL: "danger"
};
import {STATUS, TYPE} from '/imports/api/user_messages/index';
import {USER_ROLES} from '/imports/api/users/index';

/**
 * Enqueue Metrics Email Survey
 * @param job
 * @param cb
 */
const enqueueSurveys = function (job, cb) {
  try {
    const
      {type} = job.data,
      date = new Date(),
      sendingPlansList = getSendingPlans.call({date})
      ;
    let
      jobMessage = "",
      totalQueuedEmailsToEmployeesOfOrg = 0,
      logName = "sending_plan",
      logContent = {
        planId: "",
        noOfActiveOrgs: 0,
        details: []
      },
      logDetail = {
        orgId: "",
        noOfQueuedEmailsToEmployees: 0
      }
      ;

    if (_.isEmpty(sendingPlansList)) {
      jobMessage = `No request for today: ${date}`;
      job.log(jobMessage, {level: LOG_LEVEL.INFO});
      job.done();
    } else {
      sendingPlansList.map(sendingPlan => {
        const
          {metric, leaderId, sendDate, timezone} = sendingPlan,
          planId = sendingPlan._id,
          selector = {leaderId, isPresent: true, status: STATUS_ACTIVE},
          organizationList = Organizations.find(selector).fetch()
          ;

        // don't send survey to inactive leader
        if (!Roles.userIsInRole(leaderId, "inactive")) {
          logContent.planId = planId;
          if (_.isEmpty(organizationList)) {
            logContent.noOfActiveOrgs = 0;
            jobMessage = `Organizations of leader ${leaderId} not found`;
            job.log(jobMessage, {level: LOG_LEVEL.WARNING});
            setSendingPlanStatus.call({_id: planId, status: "FAILED", reason: jobMessage});
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
            logContent.noOfActiveOrgs = 0;
            setSendingPlanStatus.call({_id: logContent.planId, status: "QUEUED"});
            organizationList.map(org => {
              const employeeList = org.employees;

              logContent.noOfActiveOrgs += 1;
              logDetail.orgId = org._id;
              logDetail.noOfQueuedEmailsToEmployees = 0;
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
                        logDetail.noOfQueuedEmailsToEmployees += 1;
                        jobMessage = `Enqueue mail ${metric} to ${employee.email} on ${date}`;
                        job.log(jobMessage, {level: LOG_LEVEL.INFO});
                      } else {
                        jobMessage = `Enqueue mail ${metric} to ${employee.email} on ${date} has error: ${error.reason}`;
                        job.log(jobMessage, {level: LOG_LEVEL.WARNING});
                      }
                    });
                  }
                });
                // add message to inform the leader about the status of plan
                addMessages.call({
                  userId: leaderId,
                  type: TYPE.SURVEY,
                  message: {
                    name: `${metric} Management Survey in ${org.name} `,
                    detail: `sent to ${logDetail.noOfQueuedEmailsToEmployees} employees.`
                  },
                  status: STATUS.UNREAD,
                  date: date
                });
              }
              logContent.details.push(logDetail);
            });
          }
          // update status of plan
          if (logContent.noOfActiveOrgs === 0) {
            setSendingPlanStatus.call({_id: logContent.planId, status: "FAILED", reason: `No active organization.`});
          } else {
            totalQueuedEmailsToEmployeesOfOrg = 0;
            logContent.details.map(org => {
              totalQueuedEmailsToEmployeesOfOrg += logDetail.noOfQueuedEmailsToEmployees;
            });
            if (totalQueuedEmailsToEmployeesOfOrg === 0) {
              setSendingPlanStatus.call({
                _id: logContent.planId,
                status: "FAILED",
                reason: `No active employee in any active organization.`
              });
            } else {
              setSendingPlanStatus.call({
                _id: logContent.planId,
                status: "SENT",
                reason: `Total Org: ${logContent.noOfActiveOrgs}, Total Employees: ${totalQueuedEmailsToEmployeesOfOrg}`
              });
            }
          }
        } else {
          setSendingPlanStatus.call({_id: logContent.planId, status: "FAILED", reason: `Leader had been inactive.`});
        }

        // add log for a plan into log collection
        addLogs({params: {name: logName, content: logContent}});
      });
      job.done();
    }
  } catch (error) {
    job.fail("" + error);
  }
  // Be sure to invoke the callback
  // when work on this job has finished
  cb();
};

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
};

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
};

/**
 * Function migrate data for users from old version to the new version of theleader.io
 * @param job
 * @param cb
 */
const migrateUsers = (job, cb) => {
  const result = migrate();
  job.log(`migrated ${result} users`, {level: LOG_LEVEL.INFO});
  job.done();
};

/**
 * Function send requests about asking questions to employees
 * @param job
 * @param cb
 */
// export const sendAskingQuestionsToEmployees = (job, cb) => {
const sendAskingQuestionsToEmployees = (job, cb) => {
  const
    users = Accounts.users.find().fetch()
    ;
  let
    name = "sendAskingQuestionsToEmployees"
    ;

  if (!_.isEmpty(users)) {
    users.map(user => {
      const
        {_id: leaderId} = user,
        profile = Profiles.findOne({userId: leaderId}),
        leaderName = `${profile.firstName} ${profile.lastName}` || "leader"
        ;
      if (!Roles.userIsInRole(leaderId, USER_ROLES.INACTIVE)) {
        const orgs = Organizations.find({leaderId, isPresent: true}).fetch();
        if (!_.isEmpty(orgs)) {
          orgs.map(org => {
            const
              {_id: organizationId} = org,
              employees = Employees.find({leaderId, organizationId, status: STATUS_ACTIVE}).fetch()
              ;
            if (!_.isEmpty(employees)) {
              employees.map(employee => {
                const {_id: employeeId, email, firstName: employeeName} = employee;
                message = `send request for question to employee`;
                const template = 'questions';
                const data = {
                  leaderId,
                  leaderName,
                  organizationId,
                  employeeId,
                  employeeName,
                  email
                };
                EmailActions.send.call({template, data}, (error, result) => {
                  if (_.isEmpty(error)) {
                    Logger.info({name, message: {detail: data}});
                  } else {
                    Logger.error({name, message: {detail: error}});
                  }
                });
              });
            }
          });
        }
      }
    });
  }
  job.done();
};


// export const sendENPSToEmployees = (job, cb) => {
const sendENPSToEmployees = (job, cb) => {
  // get all active leaders
  const
    ActiveLeaders = getAllActiveUsers()
    // ActiveLeaders = ["3zL7iR7rqtvQrmXJm"]
    ;

  ActiveLeaders.map(leaderId => {
    const
      // get all present organization of a leader
      PresentOrgs = getAllPresentOrganizationOfLeader({leaderId}),
      name = 'sendENPSToEmployees'
      ;

    PresentOrgs.map(organizationId => {
      // get all active employees of a leader in 1 organization
      const ActiveEmployees = getAllActiveEmployeesOfOrganization({leaderId, organizationId});

      // create eNPS for leader
      const eNPSId = createENPS({leaderId, organizationId, interval: "EVERY_MONTH"});

      if (!_.isEmpty(eNPSId)) {
        ActiveEmployees.map(_id => {
          const
            employee = Employees.findOne({_id})
            ;

          if (!_.isEmpty(employee)) {
            // get data to send email
            const
              {_id: employeeId} = employee,
              template = 'eNPS',
              data = {
                leaderId,
                organizationId,
                employeeId,
                eNPSId
              };
            EmailActions.send.call({template, data}, (error, result) => {
              if (_.isEmpty(error)) {
                Logger.info({name, message: {detail: data}});
              } else {
                Logger.error({name, message: {detail: error}});
              }
            });
          }
        });
      } else {
        // log error
        Logger.error({name, message: {detail: `Can't create eNPS for leader: ${leaderId} in org: ${organizationId}`}});
      }
    });
  });
  job.done();
};


// Start Job
function startJob(type) {
  switch (type) {
    // daily jobs
    case "enqueue_surveys": {
      DailyJobs.processJobs(type, enqueueSurveys);
      break;
    }
    case "measure_metric": {
      DailyJobs.processJobs(type, measureMetrics);
      break;
    }
    // queue jobs
    case "send_surveys": {
      QueueJobs.processJobs(type, sendSurveys);
      break;
    }
    // queue jobs
    case "migration": {
      QueueJobs.processJobs(type, migrateUsers);
      break;
    }
    // admin jobs
    case "ask_questions": {
      AdminJobs.processJobs(type, sendAskingQuestionsToEmployees);
      break;
    }
    // admin jobs
    case "eNPS": {
      AdminJobs.processJobs(type, sendENPSToEmployees);
      break;
    }
    default: {

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