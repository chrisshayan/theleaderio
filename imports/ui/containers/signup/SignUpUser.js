import React, {Component} from 'react';
import Copyright from '/imports/ui/common/Copyright';
import {Accounts} from 'meteor/accounts-base';
import moment from 'moment';
import momentTZ from 'moment-timezone';

import SignUpForm from '/imports/ui/components/SignUpForm';

// methods
import * as ProfileActions from '/imports/api/profiles/methods';
import * as TokenActions from '/imports/api/tokens/methods';
import * as EmailActions from '/imports/api/email/methods';
import { create as createScheduler } from '/imports/api/scheduler/methods';

// constants
import {DOMAIN} from '/imports/startup/client/routes';
import { DEFAULT_SCHEDULER } from '/imports/utils/defaults';

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
      loading: true,
      errors: null
    });
    Accounts.createUser({email, password}, (error) => {
      if (!error) {
        const userId = Accounts.userId();
        const timezone = momentTZ.tz.guess();
        ProfileActions.create.call({userId, firstName, lastName, timezone}, (error) => {
          if (error) {
            this.setState({
              loading: false,
              errors: error.reason
            });
          } else {

            // create default user scheduler
            DEFAULT_SCHEDULER.map(scheduler => {
              const year = moment().year();
              const {quarter, metrics} = scheduler;
              createScheduler.call({year, quarter, metrics});
            });

            // Send confirmation email to user
            const tokenId = TokenActions.generate.call({email, action: 'email'}, (error) => {
              if (!error) {
                // call methods to send verify Email with token link to user
                // route to Welcome page with a message to verify user's email
                const verifyUrl = FlowRouter.path('signUpPage', {action: 'confirm'}, {token: tokenId});
                const url = `http://${DOMAIN}${verifyUrl}`;
                const template = 'welcome';
                const data = {
                  email: email,
                  firstName: firstName,
                  url: url
                };
                EmailActions.send.call({template, data});
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
    );
  }
}