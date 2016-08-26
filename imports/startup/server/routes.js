import {Restivus} from 'meteor/nimble:restivus';
import {Mongo} from 'meteor/mongo';

// methods
import {checkExists as checkExistsScore} from '/imports/api/metrics/methods';
import {checkExists as checkExistsFeedback} from '/imports/api/feedbacks/methods';


// functions
import {getRecipientInfo, removeWebGmailClientContent} from '/imports/api/email/functions';
import {scoringLeader} from '/imports/api/metrics/functions';
import {feedbackLeader} from '/imports/api/feedbacks/functions';

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

      const recipientInfo = getRecipientInfo({recipient, sender});
      if (recipientInfo) {
        const {planId, employeeId, leaderId, organizationId, metric} = recipientInfo;
        let result = "";

        switch (action) {
          case "score":
          {
            checkExistsScore.call({planId, organizationId, employeeId}, (error, result) => {
              if (!_.isEmpty(error)) {
                console.log(error);
              } else {
                // score of metric doesn't exists
                if (!result) {
                  const score = Number(removeWebGmailClientContent(content)[0]);
                  scoringLeader({planId, employeeId, leaderId, organizationId, metric, timestamp, score});
                } else {
                  console.log(`score exists`);
                }
              }
            });
            break;
          }
          case "feedback":
          {
            checkExistsFeedback.call({planId, organizationId, employeeId}, (error, result) => {
              if (!_.isEmpty(error)) {
                console.log(error);
              } else {
                // feedback doesn't exists
                if (!result) {
                  const feedback = removeWebGmailClientContent(content)[0];
                  feedbackLeader({planId, employeeId, leaderId, organizationId, metric, timestamp, feedback});
                } else {
                  console.log(`feedback exists`);
                }
              }
            });
            break;
          }
          default:
          {

          }
        }
      }
      // this.response.write(result);
      this.done();
    }
  }
});
