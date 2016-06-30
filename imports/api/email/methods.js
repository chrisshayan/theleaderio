import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { Email } from 'meteor/email';
import {mount} from 'react-mounter';

export const send = new ValidatedMethod({
  name: 'email.send',
  validate: null,
  run({ email, template, url }) {
    if(!this.isSimulation) {
      try {
        // We should use flow-router-ssr here
        // We now I use 2 html files, it's very manually
        const html = Assets.getText('email_templates/welcome_1.html') +
            url + Assets.getText('email_templates/welcome_2.html');
        const options = {
          to: email,
          from: 'chris@mail.theleader.io',
          subject: 'Welcome to theLeader.io',
          html: html
        };
        console.log(`Activation Url: ${url}`);
        Email.send(options);
      } catch(error) {
        console.log(`error on server: ${error}`);
      }
    }
  }
});