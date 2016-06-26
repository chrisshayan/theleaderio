import React, { Component } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

import CreateUser from '../../components/CreateUser';
import * as ProfileActions from '/imports/api/profiles/methods';
import * as TokenActions from '/imports/api/tokens/methods';

export default class SignUpPage extends Component {
  constructor() {
    super();

    this.state = {
      errors: null
    };
  }

  onSubmit({ firstName, lastName, email, password }) {
    // set State onLoading to creating account

    // Create account for user
    Accounts.createUser({ email, password }, (error) => {
      if(!error) {
        const userId = Accounts.userId();
        ProfileActions.create.call({ userId, firstName, lastName }, (error) => {
          if(error) {
            this.setState({
              // set State onLoading to null
              errors: error.reason
            });
          } else {
            const tokenId = TokenActions.generate.call({ email, password }, (error) => {
              if(!error) {
                console.log('token created');
                // call methods to send verify Email with token link to user
                // route to Welcome page with a message to verify user's email
                // for now, temporary route user to page create Alias
                const setAliasRoute = `/signup/alias?token=${tokenId}`;
                FlowRouter.go(setAliasRoute);
              }
            });
          }
        });
      } else {
        this.setState({
          // set State onLoading to null
          errors: error.reason
        });
      }
    });
  }

  render() {
    return (
      <div>
        <CreateUser
          errors = {this.state.errors }
          onSubmit = { this.onSubmit.bind(this) }
        />
      </div>
    );
  }
}