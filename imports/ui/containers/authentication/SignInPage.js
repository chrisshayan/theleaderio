import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import _ from 'lodash';

import SigninForm from '/imports/ui/components/SigninForm';
import SingleInputForm from '/imports/ui/common/SingleInputForm';
import * as SubdomainActions from '/imports/utils/subdomain';
import { userHomeRoute } from '/imports/startup/client/routes';

export default class SignInPage extends Component {
  constructor() {
    super();

    this.state = {
      alias: null, // for checking the domain which has alias as subdomain or not
      errors: null
    };
  }

  componentWillMount() {
    const subdomain = SubdomainActions.getSubdomain();
    if(subdomain === undefined) {
      this.setState({
        alias: false
      });
    } else {
      this.setState({
        alias: true
      });
    }
  }

  // submit for sign in to subdomain
  onSubmit({ email, password }) {
    Meteor.loginWithPassword(email, password, (error) => {
      if(!_.isEmpty(error)) {
        this.setState({
          errors: error.reason
        });
      } else {
        if(!_.isEmpty(Meteor.user())) {
          const userAlias = Meteor.user().username;
          const subdomain = SubdomainActions.getSubdomain();
          if(subdomain === userAlias) {
            FlowRouter.go(userHomeRoute.path);
          } else {
            this.setState({
              alias: false,
              errors: `${email} doesn't belong to ${document.location.hostname}. Please enter the correct alias.`
            });
            // render or redirect to notification page which redirect to signin alias
          }
        }
      }
    });
  }

  // submit for sign in to web address alias.theleader.io
  _inputSubmit({ inputValue }) {
    const alias = inputValue;
    const context = {
      params: {
        userAlias: alias
      }
    };
    SubdomainActions.addSubdomain(context);
  }

  render() {
    if(this.state.alias) {
      const signinTitle = `Sign in to ${document.location.hostname}`;
      return (
        <div>
          <SigninForm
            signinTitle = { signinTitle }
            errors = { this.state.errors }
            onSubmit = { this.onSubmit.bind(this) }
          />
        </div>
      );
    } else {
      return (
        <div>
          <SingleInputForm
            logoName = 'TL+'
            formTitle = 'Sign in to your web address'
            formDescription = 'Please enter you alias.'
            inputType = 'text'
            inputHolder = 'Alias'
            buttonLabel = 'Continue'
            errors = { this.state.errors }
            onSubmit = { this._inputSubmit.bind(this) }
          />
        </div>
      );
    }
  }
}