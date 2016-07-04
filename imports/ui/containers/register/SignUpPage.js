import React, {Component} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';

import CreateUser from '../../components/CreateUser';
import * as ProfileActions from '/imports/api/profiles/methods';
import * as TokenActions from '/imports/api/tokens/methods';
import * as EmailActions from '/imports/api/email/methods';
import {welcomeRoute}from '/imports/startup/client/routes';
import Spinner from '/imports/ui/common/Spinner';

export default class SignUpPage extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: null,
      errors: null
    };
  }

  onSubmit({firstName, lastName, email, password}) {
    // set State onLoading to creating account

    // Create account for user
    Accounts.createUser({email, password}, (error) => {
      if (!error) {
        const userId = Accounts.userId();
        this.setState({
          isLoading: true
        });
        ProfileActions.create.call({userId, firstName, lastName}, (error) => {
          if (error) {
            this.setState({
              isLoading: false,
              errors: error.reason
            });
          } else {
            const tokenId = TokenActions.generate.call({email, password}, (error) => {
              if (!error) {
                console.log('token created');
                // call methods to send verify Email with token link to user
                // route to Welcome page with a message to verify user's email
                // for now, temporary route user to page create Alias
                const url = `http://${document.location.hostname}:9000/signup/alias?token=${tokenId}`;
                const mailOptions = {
                  email: email,
                  template: 'verification',
                  url: url
                };
                console.log(mailOptions);
                console.log(`isLoading: ${this.state.isLoading}`);
                EmailActions.send.call(mailOptions, (error) => {
                  if (!_.isEmpty(error)) {
                    this.setState({
                      isLoading: false,
                      errors: error.reason
                    });
                  } else {
                    this.setState({
                      isLoading: false,
                      errors: null
                    });
                  }
                });
                FlowRouter.go(welcomeRoute.path);
              }
            });
          }
        });
      } else {
        this.setState({
          isLoading: false,
          errors: error.reason
        });
      }
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <Spinner />
      );
    } else {
      return (
        <div>
          <CreateUser
            errors={this.state.errors }
            onSubmit={ this.onSubmit.bind(this) }
          />
        </div>
      );
    }
  }
}