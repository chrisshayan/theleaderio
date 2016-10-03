import {Restivus} from 'meteor/nimble:restivus';
import {Mongo} from 'meteor/mongo';

// collections
import {Feedbacks} from '/imports/api/feedbacks/index';

// methods
import {checkExists as checkExistsScore} from '/imports/api/metrics/methods';
import {checkExists as checkExistsFeedback} from '/imports/api/feedbacks/methods';
import * as EmailActions from '/imports/api/email/methods';

// functions
import {getRecipientInfo, removeWebGmailClientContent} from '/imports/api/email/functions';
import {scoringLeader} from '/imports/api/metrics/functions';
import {feedbackLeader} from '/imports/api/feedbacks/functions';
import {timestampToDate} from '/imports/utils/index';

// logger
import {Logger} from '/imports/api/logger/index';

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
      const {action} = this.urlParams;
      const {
        recipient,
        sender,
        Subject,
        timestamp,
      } = this.request.body;
      const content = this.request.body["stripped-text"];

      const recipientInfo = getRecipientInfo({recipient, sender, apiName: "metrics"});
      if (!_.isEmpty(recipientInfo)) {
        if (recipientInfo.message !== 'undefined') {
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
        feedback = ""
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
              feedback = content;

              const feedbackId = Feedbacks.insert({employeeId, organizationId, leaderId, type, feedback, date});
              if(!_.isEmpty(feedbackId)) {
                // console.log(`will send feedback ${feedbackId} to employee: ${employeeId}`);
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
                    Logger.info({name, message: {detail: `Send email to employee ${employeeId} 
                              about feedback of leader ${leaderId} - success`}});
                  } else {
                    Logger.error({name, message: {detail: `Send email to employee ${employeeId} 
                              about feedback of leader ${leaderId} failed`}});
                  }
                });
              } else {
                Logger.error({name, message: {apiName, detail: `Insert feedback for employee: ${employeeId} failed 
                                with content: ${feedback}`}});
              }

            }
            default: {
              Logger.warn({name: "api", message: {apiName: "feedback", detail: `Unknown action`}});
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
