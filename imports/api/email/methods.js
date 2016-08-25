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

// constant
const SITE_NAME = Meteor.settings.public.name;


/**
 * send email use mailgun
 * @params: template, data
 */
export const send = new ValidatedMethod({
  name: 'email.send',
  validate: null,
  run({template, data}) {
    if (!this.isSimulation) {
      // console.log(template, data)
      switch (template) {
        case 'welcome': {
          break;
        }
        case 'thankyou': {
          const options = getSurveyEmailOptions({template, data});
          Email.send(options);
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
              from: `"${SITE_NAME}" <chris@mail.mailgun.com>`,
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
            from: `"${SITE_NAME}" <chris@mail.theleader.io>`,
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

  const leaderName = `${capitalize(leader.firstName)} ${capitalize(leader.lastName)}`;
  const employeeName = `${capitalize(employee.firstName)} ${capitalize(employee.lastName)}`;
  to = employee.email;
  const alias = leaderData.username;
  // this could be a url to tutorial video which guide to score the metric
  const url = `http://${alias}.${domain}`;


  // get message for every type of metrics
  const EMAIL_TEMPLATE_CONTENT = getDefaults.call({name: 'EMAIL_TEMPLATE_CONTENT'}).content;
  let
    title = "",
    message = "";

  // get subject and message
  switch (template) {
    case "survey": {
      from = `"${SITE_NAME}" <${planId}-${organizationId}-survey@${mailDomain}>`;
      subject = `How many score about "${capitalize(metric)}" for ${leaderName}?`;
      message = EMAIL_TEMPLATE_CONTENT.metrics[template][metric].message;
      break;
    }
    case "survey_error": {
      from = `"${SITE_NAME}" <${planId}-${organizationId}-survey@${mailDomain}>`;
      subject = `Please correct the score about "${capitalize(metric)}" for ${leaderName}.`;
      message = EMAIL_TEMPLATE_CONTENT.metrics[template][metric].message;
      break;
    }
    case "feedback": {
      from = `"${SITE_NAME}" <${planId}-${organizationId}-feedback@${mailDomain}>`;
      subject = `How could "${leaderName}" improve the ${metric} for higher score?`;
      message = EMAIL_TEMPLATE_CONTENT.metrics[template].message;
      break;
    }
    case "thankyou": {
      const {type} = data;
      from = `"${SITE_NAME}" <${planId}-${organizationId}-thankyou@${mailDomain}>`;
      subject = `Thank you for your ${type}`;
      message = EMAIL_TEMPLATE_CONTENT.metrics[template].message;
      break;
    }
  }

  html = EmailFunctions.buildHtml({
    template, data: {
      name: `${employeeName}`,
      title: `Help your leader "${leaderName}" to improve "${capitalize(metric)}" skill`,
      message: message,
      url
    }
  });
  // console.log({from, to, subject, html})
  return {from, to, subject, html};
}
