import React, {Component} from 'react';
import Copyright from '/imports/ui/common/Copyright';
import {Accounts} from 'meteor/accounts-base';

import SignUpForm from '/imports/ui/components/SignUpForm';

import * as ProfileActions from '/imports/api/profiles/methods';
import * as TokenActions from '/imports/api/tokens/methods';
import * as EmailActions from '/imports/api/email/methods';

import {DOMAIN} from '/imports/startup/client/routes';

export default class SignUpUser extends Component {
  constructor() {
    super();

    this.state = {
      loading: null,
      errors: null
    };
  }

  onSubmit({firstName, lastName, email, password}) {
    // set State onLoading to creating account

    // Create account for user
    this.setState({
      loading: true
    });
    Accounts.createUser({email, password}, (error) => {
      if (!error) {
        const userId = Accounts.userId();
        ProfileActions.create.call({userId, firstName, lastName}, (error) => {
          if (error) {
            this.setState({
              loading: false,
              errors: error.reason
            });
          } else {
            // Send confirmation email to user
            const tokenId = TokenActions.generate.call({email, action: 'email'}, (error) => {
              if (!error) {
                // call methods to send verify Email with token link to user
                // route to Welcome page with a message to verify user's email
                const verifyUrl = FlowRouter.path('signUpPage', {action: 'confirm'}, { token: tokenId});
                const url = `http://${DOMAIN}${verifyUrl}`;
                const mailOptions = {
                  email: email,
                  firstName: firstName,
                  url: url,
                  templateName: 'welcome'
                };
                EmailActions.send.call(mailOptions);
              }
            });
            FlowRouter.go('signUpPage', {action: 'alias'});
          }
        });
      } else {
        this.setState({
          loading: false,
          errors: error.reason
        });
      }
    });
  }

  render() {

    return (
      <div id="page-top">
        <div className="middle-box text-center loginscreen   animated fadeInDown">
          <div>
            <h1 className="logo-name">TL+</h1>
          </div>
          <h3>
            Being a true leader doesn’t come from a title, it is a designation you must earn from the people you lead.</h3>
          <p>Become a good leader from today.</p>
          <SignUpForm
            errors={this.state.errors}
            onSubmit={this.onSubmit.bind(this)}
          />
          <Copyright />
        </div>
      </div>
    );
  }
}