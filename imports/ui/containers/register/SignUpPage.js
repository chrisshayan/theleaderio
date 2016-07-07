import React, {Component} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';

import SignUpUser from '../../components/SignUpUser';
import * as ProfileActions from '/imports/api/profiles/methods';
import * as TokenActions from '/imports/api/tokens/methods';
import * as EmailActions from '/imports/api/email/methods';
import {welcomeRoute}from '/imports/startup/client/routes';
import Spinner from '/imports/ui/common/Spinner';

export default class SignUpPage extends Component {
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
            const tokenId = TokenActions.generate.call({email}, (error) => {
              if (!error) {
                // call methods to send verify Email with token link to user
                // route to Welcome page with a message to verify user's email
                const url = `http://${document.location.hostname}:9000/signup/alias?token=${tokenId}`;
                const mailOptions = {
                  email: email,
                  firstName: firstName,
                  url: url,
                  templateName: 'welcome'
                };
                EmailActions.send.call(mailOptions, (error) => {
                  if (!_.isEmpty(error)) {
                    this.setState({
                      errors: error.reason
                    });
                  } else {
                    this.setState({
                      errors: null
                    });
                  }
                  this.setState({
                    loading: false
                  });
                });
                FlowRouter.go(welcomeRoute.path);
              }
            });
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
    if (this.state.loading) {
      return (
        <div id="page-top" className="gray-bg">
          <Spinner
            message='Creating account ...'
          />
        </div>
      );
    } else {
      return (
        <div id="page-top" className="gray-bg">
          <SignUpUser
            errors={this.state.errors }
            onSubmit={ this.onSubmit.bind(this) }
          />
        </div>
      );
    }
  }
}