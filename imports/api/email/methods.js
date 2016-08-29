import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {Email} from 'meteor/email';
import {Accounts} from 'meteor/accounts-base';
import {Meteor} from 'meteor/meteor';

// functions
import * as EmailFunctions from '/imports/api/email/functions';

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
      switch (template) {
        case 'welcome': {
          break;
        }
        case 'thankyou': {
          const options = EmailFunctions.getSurveyEmailOptions({template, data});
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
          const options = EmailFunctions.getSurveyEmailOptions({template, data});
          console.log(options)
          Email.send(options);
          break;
        }
        case 'survey_error': {
          const options = EmailFunctions.getSurveyEmailOptions({template, data});
          Email.send(options);
          break;
        }
        case 'feedback': {
          const options = EmailFunctions.getSurveyEmailOptions({template, data});
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

