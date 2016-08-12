import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Email } from 'meteor/email';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import {words as capitalize} from 'capitalize';

// collections
import {Profiles} from '/imports/api/profiles/index';
import {Organizations} from '/imports/api/organizations/index';
import {Employees} from '/imports/api/employees/index';

// functions
import * as EmailFunctions from '/imports/api/email/functions';

// constants
import * as ERROR_CODE from '/imports/utils/error_code';
const {domain, mailDomain} = Meteor.settings.public;

/**
 * send email use mailgun
 * params: templatename, data
 */
export const send = new ValidatedMethod({
  name: 'email.send',
  validate: null,
  run({template, data}) {
    if(!this.isSimulation) {
      switch(template) {
        case 'welcome': {

        }
        case 'forgot_alias': {
          const { email, firstName, url } = data;
          const user = Accounts.findUserByEmail(email);
          if(!_.isEmpty(user)) {
            const alias = user.username;
            const loginUrl = `http://${alias}.${url}`;
            // Get email html
            const html = EmailFunctions.get({ templateName, firstName, url: loginUrl, alias });
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
          const { email, url } = data;
          const html = EmailFunctions.get({ template, url });
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
          const {employeeId, leaderId, organizationId, metric} = data;
          const options = getSurveyEmailOptions({template, employeeId, leaderId, organizationId, metric});
          Email.send(options);
          break;
        }
        default: {

        }
      }
    }
  }
});

/**
 * Function to collect content data for survey email
 * @param employeeId
 * @param leaderId
 * @param organizationId
 * @param metric
 */
function getSurveyEmailOptions({template, employeeId, leaderId, organizationId, metric}) {
  let
    from = "",
    to = "",
    subject = "",
    html = ""
    ;

  const employee = Employees.findOne({_id: employeeId});
  if(_.isEmpty(employee)) {
    return new Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND, `employee ${employeeId} not found`);
  }
  const leaderData = Accounts.users.findOne({_id: leaderId});
  if(_.isEmpty(leaderData)) {
    return new Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND, `leader ${leaderId} not found`);
  }
  const leader = Profiles.findOne({userId: leaderId});
  if(_.isEmpty(leader)) {
    return new Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND, `leader ${leaderId} not found`);
  }
  const organization = Organizations.findOne({_id: organizationId});
  if(_.isEmpty(organization)) {
    return new Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND, `organization ${organizationId} not found`);
  }

  from = `${leaderId}-${organizationId}-${template}@${mailDomain}`;
  to = employee.email;
  subject = `How many score about "${capitalize(metric)}" for ${capitalize(leader.firstName)} ${capitalize(leader.lastName)}?`;

  const alias = leaderData.username;
  const url = `http://${alias}.${domain}`;
  html = EmailFunctions.buildHtml({ template, data: {
    name: `${capitalize(employee.firstName)} ${capitalize(employee.lastName)}`,
    title: `Help your leader ${capitalize(leader.firstName)} ${capitalize(leader.lastName)} to improve his/her ${capitalize(metric)}`,
    message: `${capitalize(metric)} is a important metric for blah blah blah, reply this email with the number of score`,
    url
  }});

  return {
    from,
    to,
    subject,
    html
  };
}