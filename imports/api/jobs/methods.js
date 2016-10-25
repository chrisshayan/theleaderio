import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {later} from 'meteor/mrt:later';

// Job Collection
import {AdminJobs} from '/imports/api/jobs/collections';

// collections
import {Organizations} from '/imports/api/organizations/index';
import {Employees} from '/imports/api/employees/index';
import {SendingPlans} from '/imports/api/sending_plans/index';
import {Metrics} from '/imports/api/metrics/index';
import {Feedbacks} from '/imports/api/feedbacks/index';
import {LogsDigest} from '/imports/api/logs/index';

// Job
import {Jobs} from '/imports/api/jobs/jobs';

// methods
import * as EmailActions from '/imports/api/email/methods';

// functions
import {getRandomEmployee} from '/imports/api/organizations/functions';
import {getLeaderForDigestEmail} from '/imports/api/admin/functions';
import {add as addLogs} from '/imports/api/logs/functions';

// constants
import * as ERROR_CODE from '/imports/utils/error_code';
import {LOG_LEVEL} from '/imports/utils/defaults';

/**
 * Function send email to leader to receive feedback for an employee who will be choose randomly
 * @param job
 * @param cb
 */
const sendFeedbackEmailToLeader = function (job, cb) {
  const
    name = "sendFeedbackEmailToLeader",
    activeOrgList = Organizations.find({isPresent: true}, {fields: {_id: true}}).fetch()
    ;
  let
    employee = {},
    employeeData = {},
    jobMessage = ""

  if (_.isEmpty(activeOrgList)) {
    jobMessage = `No active organization`;
    job.log(jobMessage, {level: LOG_LEVEL.INFO});
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
 * Function send email to leader to receive feedback for an employee who will be choose randomly
 * @param job
 * @param cb
 */
export const sendStatisticEmailToLeader = function (job, cb) {
  const
    startDate = new Date(moment().subtract(12, 'day')),
    currentDate = new Date(),
    leaderIdList = getLeaderForDigestEmail({params: {startDate, endDate: currentDate}})
    ;
  let
    query = {},
    options = {},
    orgs = [],
    employee = [],
    plan = [],
    metrics = [],
    feedback = [],
    latestUpdatedAt = startDate,
    totalLeaders = 0,
    digest = {
      leaderId: "",
      updateEmployeeList: {
        startDate
      },
      sendingPlanStatus: {
        sendFailed: false,
        message: "",
        reason: "",
        suggest: "",
      },
      leadershipProgress: {
        haveProgress: true,
        totalBadScores: 0,
        totalGoodScores: 0,
        totalFeedback: 0,
      },
      orgInfo: {
        haveActiveOrg: false,
        totalEmployees: 0 // in active orgs.
      },
      articles: {
        haveArticles: false,
        metricToImprove: "",
        articles: [
          {
            url: "",
            subject: ""
          }
        ]
      },
    },
    logName = "digest",
    logContent = {
      interval: "weekly",
      details: []
    },
    logContentDetails = {
      leaderId: "",
      status: ""
    }
    ;

  if (!_.isEmpty(leaderIdList)) {
    totalLeaders = leaderIdList.length;
    leaderIdList.map(leaderId => {
      // initiate
      options = {};
      orgs = [];
      employee = [];
      plan = [];
      metrics = [];
      feedback = [];
      // latestUpdatedAt = startDate;
      // digest values
      digest = {
        leaderId,
        updateEmployeeList: {
          startDate: moment(startDate).format("MMMM Do, YYYY")
        },
        sendingPlanStatus: {
          sendFailed: false,
          message: "",
          reason: "",
          suggest: "",
        },
        leadershipProgress: {
          haveProgress: true,
          totalBadScores: 0,
          totalGoodScores: 0,
          totalFeedback: 0,
        },
        orgInfo: {
          haveActiveOrg: false,
          totalEmployees: 0 // in active orgs.
        },
        articles: {
          haveArticles: false,
          metricToImprove: "",
          articles: [
            {
              url: "",
              subject: ""
            }
          ]
        },
      }
      ;

      logContentDetails.leaderId = leaderId;
      // get org information
      query = {leaderId, isPresent: true};
      // options = {
      //   sort: {updatedAt: -1},
      //   limit: 1
      // };
      orgs = Organizations.find(query).fetch();
      if (!_.isEmpty(orgs)) {
        digest.orgInfo.haveActiveOrg = true;
        orgs.map(org => {
          digest.orgInfo.totalEmployees += org.employees.length;
        });
      }

      // get sending plan status
      query = {leaderId, status: {$not: /READY/}, sendDate: {$gte: startDate, $lt: currentDate}};
      options = {
        sort: {sendDate: -1},
        limit: 1
      };
      plan = SendingPlans.find(query, options).fetch();
      if (!_.isEmpty(plan)) {
        if (plan[0].status === "FAILED") {
          digest.sendingPlanStatus.sendFailed = true;
          digest.sendingPlanStatus.message = `The "${plan[0].metric}" survey couldn't be sent on ${moment(plan[0].sendDate).format('MMMM Do, YYYY')}.`;
          if (typeof plan[0].reason !== 'undefined') {
            digest.sendingPlanStatus.reason = `Because ${plan[0].reason}`;
          }
          digest.sendingPlanStatus.suggest = "Please make sure that you have at least one current organization and there are employees in it.";
        } else {
          digest.sendingPlanStatus = {
            sendFailed: false
          };
        }
      }

      // leadership progress
      // get total of bad & good scores of leader in last week for every metric (if they have)
      query = {leaderId, date: {$gte: startDate, $lt: currentDate}};
      options = {
        fields: {
          metric: true,
          score: true,
          date: true
        }
      };
      metrics = Metrics.find(query, options).fetch();
      if (!_.isEmpty(metrics)) {
        metrics.map(metric => {
          if (metric.score > 3) {
            digest.leadershipProgress.totalGoodScores += 1;
          }
          if (metric.score > 0 && metric.score < 4) {
            digest.leadershipProgress.totalBadScores += 1;
          }
        });
      }
      // get total of feedback from employees and their topics.
      query = {leaderId, date: {$gte: startDate, $lt: currentDate}, type: {$not: /LEADER_TO_EMPLOYEE/}};
      options = {
        fields: {
          leaderId: true,
          metric: true,
          feedback: true,
          date: true
        }
      };
      feedback = Feedbacks.find(query, options).fetch();
      if (!_.isEmpty(feedback)) {
        feedback.map(feed => {
          digest.leadershipProgress.totalFeedback += 1;
        });
      }
      if((digest.leadershipProgress.totalFeedback +
          digest.leadershipProgress.totalGoodScores +
          digest.leadershipProgress.totalBadScores) === 0) {
        digest.leadershipProgress.haveProgress = false;
      }

      // get article for leader base on the bad score of metric or the topics of negative feedback
      // not implemented yet

      // send digest email to leader
      const template = 'digest';
      const data = {
        digest
      };
      EmailActions.send.call({template, data}, (error) => {
        if (_.isEmpty(error)) {
          logContentDetails.status = "sent";
        } else {
          logContentDetails.status = `failed - ${error.reason}`;
        }
      });
      // console.log(digest)

      logContent.details.push(logContentDetails);
    });

    // add log for a digest into log collection
    addLogs({params: {name: logName, content: logContent}});
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
        message = "",
        worker = () => null
        ;

      // get worker
      switch (type) {
        case "feedback_for_employee": {
          worker = sendFeedbackEmailToLeader;
          break;
        }
        case "statistic_for_leader": {
          worker = sendStatisticEmailToLeader;
          break;
        }
        default: {

        }
      }

      // get current job
      jobs = AdminJobs.find({type, status: {$in: AdminJobs.jobStatusCancellable}}, {
        fields: {
          _id: true,
          status: true
        }
      }).fetch();
      if (_.isEmpty(jobs)) {
        // console.log(`create new job ${type}`)
        message = Jobs.create(type, attributes, data);
        AdminJobs.processJobs(type, worker);
        return {message}; // return new job id
      } else {
        jobs.map(job => {
          if (job.status === "running") {
            message = "running";
            return {message}; // job running, couldn't update
          } else {
            status = AdminJobs.cancelJobs([job._id]);
            if (status) {
              // console.log(`cancel job, create new job`)
              // cancel job success, create new job with new attributes
              message = Jobs.create(type, attributes, data);
              AdminJobs.processJobs(type, worker);
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

