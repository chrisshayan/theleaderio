import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { Email } from 'meteor/email';


export const send = new ValidatedMethod({
  name: 'email.send',
  action() {

  }
});