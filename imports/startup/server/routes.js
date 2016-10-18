import {Restivus} from 'meteor/nimble:restivus';
import {Mongo} from 'meteor/mongo';

// collections
import {Feedbacks} from '/imports/api/feedbacks/index';
import {Employees} from '/imports/api/employees/index';

// methods
import {checkExists as checkExistsScore} from '/imports/api/metrics/methods';
import {checkExists as checkExistsFeedback} from '/imports/api/feedbacks/methods';
import * as EmailActions from '/imports/api/email/methods';
import {add as addMessages} from '/imports/api/user_messages/methods';

// functions
import {getRecipientInfo, removeWebGmailClientContent} from '/imports/api/email/functions';
import {scoringLeader} from '/imports/api/metrics/functions';
import {feedbackLeader} from '/imports/api/feedbacks/functions';
import {timestampToDate} from '/imports/utils/index';
import {verifySenderEmail} from '/imports/api/email/functions';

// logger
import {Logger} from '/imports/api/logger/index';

// constants
import {TYPE, STATUS} from '/imports/api/user_messages/index';

/**
 * @summary Routes for handling inbound emails
 * @params
 */


// Global API configuration
const Api = new Restivus({
  useDefaultAuth: false,
  prettyJson: true
});


// Maps to: /api/metrics/
Api.addRoute('metrics/:action', {authRequired: false}, {
  post: {
    action: function () {
      const
        {action} = this.urlParams,
        {
          recipient,
          sender,
          Subject,
          timestamp,
        } = this.request.body,
        content = this.request.body["stripped-text"],
        recipientInfo = getRecipientInfo({recipient, sender, apiName: "metrics"})
        ;

      if (!_.isEmpty(recipientInfo)) {
        if (recipientInfo.message === 'undefined') {
          Logger.error({name: "api", message: {apiName: "metrics", detail: recipientInfo.message}});
          this.response.writeHead(404, {'Content-Type': 'text/plain'});
          this.response.write(recipientInfo.message);
        } else {
          const {planId, employeeId, leaderId, organizationId, metric} = recipientInfo;
          let result = "";

          switch (action) {
            case "score": {
              checkExistsScore.call({planId, organizationId, employeeId}, (error, result) => {
                if (!_.isEmpty(error)) {
                  Logger.error({name: "api", message: {apiName: "metrics", detail: error.reason}});
                } else {
                  // score of metric doesn't exists
                  if (!result) {
                    const score = Number(removeWebGmailClientContent(content)[0]);
                    scoringLeader({planId, employeeId, leaderId, organizationId, metric, timestamp, score});
                  } else {
                    Logger.warn({name: "api", message: {apiName: "metrics", detail: `score exists`}});
                  }
                }
              });
              break;
            }
            case "feedback": {
              checkExistsFeedback.call({planId, organizationId, employeeId}, (error, result) => {
                if (!_.isEmpty(error)) {
                  Logger.error({name: "api", message: {apiName: "metrics", detail: error.reason}});
                } else {
                  // feedback doesn't exists
                  if (!result) {
                    const feedback = removeWebGmailClientContent(content)[0];
                    feedbackLeader({planId, employeeId, leaderId, organizationId, metric, timestamp, feedback});
                  } else {
                    Logger.warn({name: "api", message: {apiName: "metrics", detail: `feedback exists`}});
                  }
                }
              });
              break;
            }
            default: {
              Logger.warn({name: "api", message: {apiName: "metrics", detail: `Unknown action`}});
              this.response.writeHead(404, {'Content-Type': 'text/plain'});
              this.response.write("Unknown action");
            }
          }
        }
      }
      this.done();
    }
  }
});

Api.addRoute('employee/:action', {authRequired: false}, {
  post: {
    action: function () {
      const
        name = "api",
        apiName = "employee",
        {action} = this.urlParams,
        {
          recipient,
          sender,
          Subject,
          timestamp,
        } = this.request.body,
        content = this.request.body["stripped-text"],
        date = timestampToDate(timestamp),
        recipientInfo = getRecipientInfo({recipient, sender, apiName})
        ;
      let
        type = "",
        feedback = "",
        verifySender = {},
        employee = {}
        ;


      if (!_.isEmpty(recipientInfo)) {
        if (recipientInfo.message === 'undefined') {
          Logger.error({name, message: {apiName, detail: recipientInfo.message}});
          this.response.writeHead(404, {'Content-Type': 'text/plain'});
          this.response.write(recipientInfo.message);
        } else {
          const
            {employeeId, organizationId, leaderId} = recipientInfo
            ;
          switch (action) {
            case "feedback": {
              type = "LEADER_TO_EMPLOYEE";
              feedback = removeWebGmailClientContent(content)[0];
              verifySender = verifySenderEmail({params: {
                type: "leader",
                email: sender,
                id: leaderId
              }});

              if(!_.isEmpty(verifySender)) {
                if(verifySender.isLeader) {
                  const feedbackId = Feedbacks.insert({employeeId, organizationId, leaderId, type, feedback, date});
                  if (!_.isEmpty(feedbackId)) {
                    const
                      template = 'employee',
                      data = {
                        type: "inform_feedback",
                        employeeId,
                        leaderId,
                        organizationId,
                        feedback
                      };
                    EmailActions.send.call({template, data}, (error) => {
                      if (_.isEmpty(error)) {
                        Logger.info({
                          name, message: {
                            detail: `Send email to employee ${employeeId} 
                              about feedback of leader ${leaderId} - success`
                          }
                        });
                        employee = Employees.findOne({_id: employeeId});
                        if(!_.isEmpty(employee)) {
                          addMessages.call({
                            userId: leaderId,
                            type: TYPE.FB_TO_EMPLOYEE,
                            message: {
                              name: `Feedback to ${employee.firstName} ${employee.lastName}`,
                              detail: "had been sent."
                            },
                            status: STATUS.UNREAD,
                            date: date
                          });
                        }
                      } else {
                        Logger.error({
                          name, message: {
                            detail: `Send email to employee ${employeeId} 
                              about feedback of leader ${leaderId} failed`
                          }
                        });
                      }
                    });
                  } else {
                    Logger.error({
                      name, message: {
                        apiName, detail: `Insert feedback for employee: ${employeeId} failed 
                                with content: ${feedback}`
                      }
                    });
                  }
                } else {
                  Logger.error({name, message: {apiName, detail: verifySender.message}});
                  this.response.writeHead(404, {'Content-Type': 'text/plain'});
                  this.response.write(verifySender.message);
                  this.done();
                }
              }
              break;
            }
            default: {
              Logger.warn({name: "api", message: {apiName: "feedback", detail: `Unknown action`}});
              this.response.writeHead(404, {'Content-Type': 'text/plain'});
              this.response.write("Unknown action");
              this.done();
            }
          }
        }
      }
      this.done();
    }
  }
});
