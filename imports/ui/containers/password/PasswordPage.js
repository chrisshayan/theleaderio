import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import _ from 'lodash';


import SingleInputFrom from '/imports/ui/common/SingleInputForm';
import NoticeForm from '/imports/ui/common/NoticeForm';
import Spinner from '/imports/ui/common/Spinner';
import Copyright from '/imports/ui/common/Copyright';

import * as EmailActions from '/imports/api/email/methods';
import * as SubdomainActions from '/imports/utils/subdomain';
import * as TokenActions from '/imports/api/tokens/methods';
import * as UserActions from '/imports/api/users/methods';

export default class PasswordPage extends Component {
  constructor() {
    super();

    this.state = {
      loading: null,
      alias: null,
      action: null,
      errors: null
    };
  }

  componentWillMount() {
    const alias = Session.get('alias');
    UserActions.verify.call({alias}, (error) => {
      if (_.isEmpty(error)) {
        const action = FlowRouter.getParam("action");
        this.setState({
          alias: true,
          action: action
        });
      } else {
        this.setState({
          alias: false,
          errors: `Alias doesn't exists`
        });
      }
    });
  }

  _inputSubmit({inputValue}) {
    const alias = SubdomainActions.getSubdomain(),
      domain = Meteor.settings.public.domain,
      email = inputValue;
    this.setState({
      loading: true,
      action: 'sending',
      errors: null
    });

    // verify Alias with email input first
    UserActions.verify.call({alias, email}, (error) => {
      if (_.isEmpty(error)) {
        const tokenId = TokenActions.generate.call({email, action: 'password'}, (error) => {
          if (_.isEmpty(error)) {
            // call methods to send verify Email with token link to user
            // route to Welcome page with a message to verify user's email
            const
              setPassUrl = FlowRouter.path('passwordPage', {action: 'set'}, {token: tokenId}),
              DOMAIN = Meteor.settings.public.domain,
              url = `http://${alias}.${DOMAIN}${setPassUrl}`,
              template = 'forgot_password',
              data = {
                email: email,
                url,
              };
            EmailActions.send.call({template, data}, (error) => {
              if (!_.isEmpty(error)) {
                this.setState({
                  loading: false,
                  action: 'failed',
                  errors: error.reason
                });
              } else {
                this.setState({
                  loading: false,
                  errors: null,
                  action: 'sent'
                });
              }
            });
          }
        });
      } else {
        this.setState({
          loading: false,
          action: 'forgot',
          errors: `${email} & ${alias}.${domain} unmatched`
        });
      }
    });
  }

  render() {
    const formTitle = `Password ${this.state.action}`;
    const formDescription = `Enter your email address you use to sign in to ${document.location.hostname}`;
    if (this.state.loading) {
      return (
        <div id="page-top">
          <Spinner
            message={this.state.action == 'sending' ? 'Sending ...' : 'Loading ...'}
          />
        </div>
      );
    } else if (this.state.alias) {
      if (this.state.action === 'forgot' || this.state.action === 'reset') {
        return (
          <div id="page-top">
            <div className="middle-box text-center loginscreen   animated fadeInDown">
              <h1>{ formTitle }</h1>
              <p>{formDescription}</p>
              <SingleInputFrom
                inputType='email'
                inputHolder='Email address'
                buttonLabel='Send reset link'
                errors={ this.state.errors }
                onSubmit={ this._inputSubmit.bind(this) }
              />
              <Copyright />
            </div>
          </div>
        );
      } else if (this.state.action === 'sent') {
        return (
          <div id="page-top">
            <NoticeForm
              code=''
              message='Email sent'
              description='Please check your inbox for instructions from us on how to reset your password.'
              buttonLabel='Come back to HomePage'
              redirectUrl='/'
            />
          </div>
        );
      }
    } else if (!this.state.alias) {
      return (
        <div id="page-top">
          <NoticeForm
            code='404'
            message={ this.state.errors }
            redirectUrl='/'
          />
        </div>
      );
    }
  }
}