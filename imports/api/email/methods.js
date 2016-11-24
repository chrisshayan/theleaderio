import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {Email} from 'meteor/email';
import {Accounts} from 'meteor/accounts-base';
import {Meteor} from 'meteor/meteor';

// functions
import * as EmailFunctions from '/imports/api/email/functions';
import {add as addLogs} from '/imports/api/logs/functions';

// constant
const {domain, mailDomain} = Meteor.settings.public;
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
      let
        options = {},
        logName = "sendEmail",
        logContent = {
          subject: "",
          from: "",
          to: "",
          template,
          data
        }
        ;

      // get options base on template
      switch (template) {
        case 'welcome': {
          const {email, firstName, url} = data,
            mailData = {
              siteUrl: `http://${domain}`,
              siteName: SITE_NAME,
              url,
              leaderName: ""
            };

          mailData.leaderName = firstName;

          const html = EmailFunctions.buildHtml({template, data: mailData});
          options = {
            to: email,
            from: `"${mailData.siteName}" <no-reply@mail.theleader.io>`,
            subject: `Welcome to ${mailData.siteName}`,
            html: html,
            tag: "registration",
            userVariables: {template}
          };
          break;
        }
        case 'thankyou': {
          options = EmailFunctions.getSurveyEmailOptions({template, data});
          break;
        }
        case 'forgot_alias': {
          const
            {email, url} = data,
            mailData = {
              siteUrl: `http://${domain}`,
              siteName: SITE_NAME,
              url: "",
              alias: ""
            },
            user = Accounts.findUserByEmail(email);
          if (!_.isEmpty(user)) {
            mailData.alias = user.username;
            mailData.url = `http://${mailData.alias}.${url}`;
            // Get email html
            const html = EmailFunctions.buildHtml({template, data: mailData});
            options = {
              to: email,
              from: `"${mailData.siteName}" <no-reply@mail.theleader.io>`,
              subject: `Get your alias`,
              html: html,
              tag: "forgotAlias",
              userVariables: {template, emailId: `${email}-${mailData.alias}`}
            };
          } else {
            throw new Meteor.Error('user not found');
          }
          break;
        }
        case 'forgot_password': {
          // Forgot / Reset password
          // Get email html
          const {email, url} = data,
            mailData = {
              siteUrl: `http://${domain}`,
              siteName: SITE_NAME,
              actionWarning: `You told us you forgot your password`,
              actionMessage: `If you didn't mean to reset your password, then you can just ignore this email, your password will not change.`,
              actionGuide: `If you really did, click here to choose a new one:`,
              actionButtonLabel: `Choose a new password`,
              resetPasswordUrl: url
            };
          console.log(mailData.resetPasswordUrl)


          // const html = EmailFunctions.get({template, url});
          const html = EmailFunctions.buildHtml({template, data: mailData});
          options = {
            to: email,
            from: `"${mailData.siteName}" <no-reply@mail.theleader.io>`,
            subject: `Forgot password`,
            html: html,
            tag: "forgotPassword",
            userVariables: {template, emailId: `${email}`}
          };
          break;
        }
        case 'survey': {
          options = EmailFunctions.getSurveyEmailOptions({template, data});
          break;
        }
        case 'survey_error': {
          options = EmailFunctions.getSurveyEmailOptions({template, data});
          break;
        }
        case 'feedback': {
          options = EmailFunctions.getSurveyEmailOptions({template, data});
          break;
        }
        case "employee": {
          options = EmailFunctions.getEmployeeEmailOptions({template, data});
          break;
        }
        case 'migration': {
          const {email, firstName, url} = data,
            mailData = {
              siteUrl: `http://${domain}`,
              siteName: SITE_NAME,
              url,
              leaderName: ""
            };

          mailData.leaderName = firstName;

          const html = EmailFunctions.buildHtml({template, data: mailData});
          options = {
            to: email,
            from: `"${mailData.siteName}" <no-reply@mail.theleader.io>`,
            subject: `Leadership in Action`,
            html: html
          };
          break;
        }
        case 'digest': {
          options = EmailFunctions.getDigestEmailOptions({template, data});
          break;
        }
        case 'referral': {
          options = EmailFunctions.getReferralEmailOptions({template, data});
          break;
        }
        default: {
          throw new Meteor.Error(`Unknown template: ${template}`);
        }
      }

      // send email
      return Meteor.defer(() => {
        // console.log(options);
        // Email.send(options);
        EmailFunctions.sendMail({options});
        // console.log(sendMailResult);
        // add log for a digest into log collection
        logContent = {
          ...logContent,
          subject: options.subject,
          from: options.from,
          to: options.to
        };
        addLogs({params: {name: logName, content: logContent}});
      });
    }
  }
});

