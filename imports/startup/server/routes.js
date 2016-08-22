import {Restivus} from 'meteor/nimble:restivus';
import {Mongo} from 'meteor/mongo';

// functions
import {scoringLeader, feedbackLeader} from '/imports/api/metrics/functions';

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
    action: function() {
      const {action} = this.urlParams;
      const {
        recipient,
        sender,
        Subject,
        timestamp,
      } = this.request.body;
      const content = this.request.body["stripped-text"];
      // console.log(this.request.body)
      let result = "";

      switch(action) {
        case "score": {
          result = scoringLeader({recipient, sender, Subject, timestamp, content});
          // console.log(result);
          break;
        }
        case "feedback": {
          result = feedbackLeader({recipient, sender, Subject, timestamp, content});
          break;
        }
        default: {

        }
      }

      // this.response.write(result);
      this.done();
    }
  }
});
