import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {Email} from 'meteor/email';
import {Accounts} from 'meteor/accounts-base';
import {Meteor} from 'meteor/meteor';
import {words as capitalize} from 'capitalize';

// collections
import {Profiles} from '/imports/api/profiles/index';
import {Organizations} from '/imports/api/organizations/index';
import {Employees} from '/imports/api/employees/index';

// functions
import * as EmailFunctions from '/imports/api/email/functions';

// methods
import {get as getDefaults} from '/imports/api/defaults/methods';

// constants
import * as ERROR_CODE from '/imports/utils/error_code';
const {domain, mailDomain} = Meteor.settings.public;
// import {EMAIL_TEMPLATE_CONTENT} from '/imports/utils/defaults';

/**
 * send email use mailgun
 * @params: template, data
 */
export const send = new ValidatedMethod({
  name: 'email.send',
  validate: null,
  run({template, data}) {
    if (!this.isSimulation) {
      switch (template) {
        case 'welcome': {
          break;
        }
        case 'thankyou': {
          break;
        }
        case 'forgot_alias': {
          const {email, firstName, url} = data;
          const user = Accounts.findUserByEmail(email);
          if (!_.isEmpty(user)) {
            const alias = user.username;
            const loginUrl = `http://${alias}.${url}`;
            // Get email html
            const html = EmailFunctions.get({template, firstName, url: loginUrl, alias});
            const options = {
              to: email,
              from: 'chris@mail.mailgun.com',
              subject: `theLeader.io`,
              html: html
            };
            Email.send(options);
          } else {
            throw new Meteor.Error('user not found');
          }
          break;
        }
        case 'forgot_password': {
          // Forgot / Reset password
          // Get email html
          const {email, url} = data;
          const html = EmailFunctions.get({template, url});
          const options = {
            to: email,
            from: 'chris@mail.theleader.io',
            subject: `theLeader.io`,
            html: html
          };

          Meteor.defer(() => {
            Email.send(options);
          });
          break;
        }
        case 'survey': {
          const options = getSurveyEmailOptions({template, data});
          Email.send(options);
          break;
        }
        case 'survey_error': {
          const options = getSurveyEmailOptions({template, data});
          Email.send(options);
          break;
        }
        case 'feedback': {
          const options = getSurveyEmailOptions({template, data});
          Email.send(options);
          break;
        }
        default:
        {

        }
      }
    }
  }
});

/**
 * Function to collect content data for survey email
 * @param template
 * @param data
 */
function getSurveyEmailOptions({template, data}) {
  const {planId, employeeId, leaderId, organizationId, metric} = data;
  let
    from = "",
    to = "",
    subject = "",
    html = ""
    ;
  const employee = Employees.findOne({_id: employeeId});
  if (_.isEmpty(employee)) {
    return new Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND, `employee ${employeeId} not found`);
  }
  const leaderData = Accounts.users.findOne({_id: leaderId});
  if (_.isEmpty(leaderData)) {
    return new Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND, `leader ${leaderId} not found`);
  }
  const leader = Profiles.findOne({userId: leaderId});
  if (_.isEmpty(leader)) {
    return new Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND, `leader ${leaderId} not found`);
  }
  const organization = Organizations.findOne({_id: organizationId});
  if (_.isEmpty(organization)) {
    return new Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND, `organization ${organizationId} not found`);
  }

  from = `${planId}-${organizationId}-${template}@${mailDomain}`;
  to = employee.email;
  const alias = leaderData.username;
  // this could be a url to tutorial video which guide to score the metric
  const url = `http://${alias}.${domain}`;


  // get message for every type of metrics
  const EMAIL_TEMPLATE_CONTENT = getDefaults.call({name: 'EMAIL_TEMPLATE_CONTENT'}).content;
  let message = "";

  // get subject and message
  if(template == "survey") {
    subject = `How many score about "${capitalize(metric)}" for ${capitalize(leader.firstName)} ${capitalize(leader.lastName)}?`;
    console.log({from, to, subject, html})
    switch (metric) {
      case "purpose":
      {
        message = EMAIL_TEMPLATE_CONTENT.metrics.survey.message.purpose;
        break;
      }
      case "mettings":
      {
        message = EMAIL_TEMPLATE_CONTENT.metrics.survey.message.mettings;
        break;
      }
      case "rules":
      {
        message = EMAIL_TEMPLATE_CONTENT.metrics.survey.message.rules;
        break;
      }
      case "communications":
      {
        message = EMAIL_TEMPLATE_CONTENT.metrics.survey.message.communications;
        break;
      }
      case "leadership":
      {
        message = EMAIL_TEMPLATE_CONTENT.metrics.survey.message.leadership;
        break;
      }
      case "workload":
      {
        message = EMAIL_TEMPLATE_CONTENT.metrics.survey.message.workload;
        break;
      }
      case "energy":
      {
        message = EMAIL_TEMPLATE_CONTENT.metrics.survey.message.energy;
        break;
      }
      case "stress":
      {
        message = EMAIL_TEMPLATE_CONTENT.metrics.survey.message.stress;
        break;
      }
      case "decision":
      {
        message = EMAIL_TEMPLATE_CONTENT.metrics.survey.message.decision;
        break;
      }
      case "respect":
      {
        message = EMAIL_TEMPLATE_CONTENT.metrics.survey.message.respect;
        break;
      }
      case "conflict":
      {
        message = EMAIL_TEMPLATE_CONTENT.metrics.survey.message.conflict;
        break;
      }
    }
  }
  if(template == "survey_error") {
    subject = `Please correct the score about "${capitalize(metric)}" for ${capitalize(leader.firstName)} ${capitalize(leader.lastName)}.`;
    switch (metric) {
      case "purpose":
      {
        message = EMAIL_TEMPLATE_CONTENT.metrics.survey_error.message.purpose;
        break;
      }
      case "mettings":
      {
        message = EMAIL_TEMPLATE_CONTENT.metrics.survey_error.message.mettings;
        break;
      }
      case "rules":
      {
        message = EMAIL_TEMPLATE_CONTENT.metrics.survey_error.message.rules;
        break;
      }
      case "communications":
      {
        message = EMAIL_TEMPLATE_CONTENT.metrics.survey_error.message.communications;
        break;
      }
      case "leadership":
      {
        message = EMAIL_TEMPLATE_CONTENT.metrics.survey_error.message.leadership;
        break;
      }
      case "workload":
      {
        message = EMAIL_TEMPLATE_CONTENT.metrics.survey_error.message.workload;
        break;
      }
      case "energy":
      {
        message = EMAIL_TEMPLATE_CONTENT.metrics.survey_error.message.energy;
        break;
      }
      case "stress":
      {
        message = EMAIL_TEMPLATE_CONTENT.metrics.survey_error.message.stress;
        break;
      }
      case "decision":
      {
        message = EMAIL_TEMPLATE_CONTENT.metrics.survey_error.message.decision;
        break;
      }
      case "respect":
      {
        message = EMAIL_TEMPLATE_CONTENT.metrics.survey_error.message.respect;
        break;
      }
      case "conflict":
      {
        message = EMAIL_TEMPLATE_CONTENT.metrics.survey_error.message.conflict;
        break;
      }
    }
  }
  if(template == "feedback") {
    subject = `How could "${capitalize(leader.firstName)} ${capitalize(leader.lastName)}" improve the ${metric} for higher score?`;
    message = EMAIL_TEMPLATE_CONTENT.metrics.feedback.message;
  }

  html = EmailFunctions.buildHtml({
    template, data: {
      name: `${capitalize(employee.firstName)} ${capitalize(employee.lastName)}`,
      title: `Help your leader "${capitalize(leader.firstName)} ${capitalize(leader.lastName)}" to improve his/her ${capitalize(metric)}`,
      message: message,
      url
    }
  });
  return {from, to, subject, html};
}
