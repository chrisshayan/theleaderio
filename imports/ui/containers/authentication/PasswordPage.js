import React, { Component } from 'react';
import _ from 'lodash';

import SingleInputFrom from '/imports/ui/common/SingleInputForm';
import InfoMessageForm from '/imports/ui/common/InfoMessageForm';
import * as UserActions from '/imports/api/users/methods';
import * as SubdomainActins from '/imports/utils/subdomain';

export default class PasswordPage extends Component {
  constructor() {
    super();

    this.state = {
      action: null,
      errors: null
    };
  }

  componentWillMount() {
    const action = FlowRouter.getParam("action");
    this.setState({
      action: action
    });
  }

  _inputSubmit({ inputValue }) {
    const alias = SubdomainActins.getSubdomain();
    const domain = window.location.hostname;
    const email = inputValue;
    console.log(`alias: ${alias}, email: ${email}`);
    UserActions.resetPassword.call({ alias, email }, (error) => {
      if(!_.isEmpty(error)) {
        this.setState({
          errors: `${email} doesn't belong to ${domain}`
        });
      } else {
        this.setState({
          action: 'sent',
          errors: null
        });
      }
    });
  }

  render() {
    const formTitle = `Password ${this.state.action}`;
    const formDescription = `Enter your email address you use to sign in to ${document.location.hostname}`;
    if(this.state.action === 'forgot' | this.state.action === 'reset') {
      return (
        <div>
          <SingleInputFrom
            logoName = 'TL+'
            formTitle = { formTitle }
            formDescription = { formDescription }
            inputType = 'email'
            inputHolder = 'Email address'
            buttonLabel = 'Send reset link'
            errors = { this.state.errors }
            onSubmit = { this._inputSubmit.bind(this) }
          />
        </div>
      );
    } else if(this.state.action === 'sent') {
      return (
        <div>
          <InfoMessageForm
            code='TL+'
            message = 'Email sent'
            description = 'Please check your inbox for instructions from us on how to reset your password.'
            buttonLabel = 'Come back to HomePage'
            redirectUrl = '/'
            redirectUrl='/'
          />
        </div>
      );
    } else {
      return (
        <div>
          <InfoMessageForm
            code='404'
            message={ this.state.errors }
            redirectUrl='/'
          />
        </div>
      );
    }
  }
}