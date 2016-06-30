import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { Email } from 'meteor/email';
import {mount} from 'react-mounter';

export const send = new ValidatedMethod({
  name: 'email.send',
  validate: null,
  run({ email, template, url }) {
    if(!this.isSimulation) {
      try {
        const options = {
          to: email,
          from: 'chris@mail.theleader.io',
          subject: 'Welcome to theLeader.io',
          html: Assets.getText('email_templates/welcome.html')
        };
        console.log(`Activation Url: ${url}`);
        Email.send(options);
      } catch(error) {
        console.log(`error on server: ${error}`);
      }

    }
  }
});