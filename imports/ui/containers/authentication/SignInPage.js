import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import _ from 'lodash';

import SigninForm from '/imports/ui/components/SigninForm';
import SingleInputForm from '/imports/ui/common/SingleInputForm';
import * as SubdomainActions from '/imports/utils/subdomain';
import {userHomeRoute, signinAliasRoute} from '/imports/startup/client/routes';

export default class SignInPage extends Component {
  constructor() {
    super();

    this.state = {
      errors: null
    };
  }

  // submit for sign in to subdomain
  onSubmit({email, password}) {
    Meteor.loginWithPassword(email, password, (error) => {
      if (!_.isEmpty(error)) {
        this.setState({
          errors: error.reason
        });
      } else {
        if (!_.isEmpty(Meteor.user())) {
          const userAlias = Meteor.user().username;
          const subdomain = SubdomainActions.getSubdomain();
          if (subdomain === userAlias) {
            FlowRouter.go(userHomeRoute.path);
          } else {
            this.setState({
              errors: `${email} doesn't belong to ${document.location.hostname}. Please enter the correct alias.`
            });
            // render or redirect to notification page which redirect to signin alias
            console.log(`will show notification to user about error: ${this.state.errors}`);
            FlowRouter.go(signinAliasRoute.path);
          }
        }
      }
    });
  }

  render() {
    const signinTitle = `Sign in to ${document.location.hostname}`;
    return (
      <div>
        <SigninForm
          signinTitle={ signinTitle }
          errors={ this.state.errors }
          onSubmit={ this.onSubmit.bind(this) }
        />
      </div>
    );

  }
}