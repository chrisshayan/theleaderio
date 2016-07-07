import React, {Component} from 'react';
import _ from 'lodash';

import { DOMAIN } from '/imports/startup/client/routes';

import SingleInputFrom from '/imports/ui/common/SingleInputForm';
import NoticeForm from '/imports/ui/common/NoticeForm';
import Spinner from '/imports/ui/common/Spinner';
import Copyright from '/imports/ui/common/Copyright';

import * as EmailActions from '/imports/api/email/methods';
import * as UserActions from '/imports/api/users/methods';

export default class ForgotAliasPage extends Component {
  constructor() {
    super();

    this.state = {
      action: null,
      errors: null,
      loading: null
    };
  }

  _inputSubmit({inputValue}) {
    const domain = window.location.hostname;
    const email = inputValue;
    this.setState({
      loading: true,
      errors: null
    });
    // verify email
    UserActions.verify.call({email}, (error) => {
      if(_.isEmpty(error)) {
        const mailOptions = {
          email: email,
          templateName: 'forgot_alias'
        };
        EmailActions.send.call(mailOptions, (error) => {
          if (!_.isEmpty(error)) {
            this.setState({
              loading: false,
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
      } else {
        console.log(error);
        this.setState({
          loading: false,
          errors: `${email} doesn't exists in ${DOMAIN}`
        });
      }
    });
  }

  render() {
    const formTitle = `Alias forgot`;
    const formDescription = `Enter your email address`;
    if (this.state.loading) {
      return (
        <div id="page-top" className="gray-bg">
          <Spinner
            message='Sending email ...'
          />
        </div>
      );
    }
    if (this.state.action === 'sent') {
      return (
        <div id="page-top" className="gray-bg">
          <NoticeForm
            code='TL+'
            message='Email sent'
            description='Please check your inbox for getting your alias.'
            buttonLabel='Come back to HomePage'
            redirectUrl='/'
          />
        </div>
      );
    } else {
      return (
        <div id="page-top" className="gray-bg">
          <div className="middle-box text-center loginscreen   animated fadeInDown">
            <div>
              <h1 className="logo-name">TL+</h1>
            </div>
            <h3>{ formTitle }</h3>
            <p>{formDescription}</p>
            <SingleInputFrom
              inputType='email'
              inputHolder='Email address'
              buttonLabel='Send me my alias'
              errors={ this.state.errors }
              onSubmit={ this._inputSubmit.bind(this) }
            />
            <Copyright />
          </div>
        </div>
      );
    }
  }
}