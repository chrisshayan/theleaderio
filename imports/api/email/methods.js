import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Email } from 'meteor/email';

import * as EmailActions from '/imports/api/email/functions';

export const send = new ValidatedMethod({
  name: 'email.send',
  validate: null,
  run({ email, firstName, url, templateName}) {
    if(!this.isSimulation) {
      try {
        // We should use flow-router-ssr here
        // We now I use 2 html files, it's very manually
        // Get email html
        const html = EmailActions.get({ templateName, firstName, url });
        const options = {
          to: email,
          from: 'chris@mail.mailgun.com',
          subject: `theLeader.io`,
          html: html
        };
        Email.send(options);
      } catch(error) {
        console.log(`error on server: ${error}`);
      }
    }
  }
});