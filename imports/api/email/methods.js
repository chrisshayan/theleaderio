import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Email } from 'meteor/email';
import { Accounts } from 'meteor/accounts-base';

import * as EmailActions from '/imports/api/email/functions';

export const send = new ValidatedMethod({
  name: 'email.send',
  validate: null,
  run({ email, firstName, url, templateName}) {
    if(!this.isSimulation) {
      try {
        // Forgot alias
        if(templateName == 'forgot_alias') {
          const user = Accounts.findUserByEmail(email);
          if(!_.isEmpty(user)) {
            const alias = user.username;
            // Get email html
            const html = EmailActions.get({ templateName, firstName, alias });
            const options = {
              to: email,
              from: 'chris@mail.mailgun.com',
              subject: `theLeader.io`,
              html: html
            };
            Email.send(options);
          } else {
            throw new Error('user not found');
          }
        } else {
          // Forgot / Reset password
          // Get email html
          const html = EmailActions.get({ templateName, firstName, url });
          const options = {
            to: email,
            from: 'chris@mail.mailgun.com',
            subject: `theLeader.io`,
            html: html
          };
          console.log(`sending welcome email`);
          Email.send(options);
        }

      } catch(error) {
        console.log(`error on server: ${error}`);
      }
    }
  }
});