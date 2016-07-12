import React, {Component} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';

import SingleInputForm from '/imports/ui/common/SingleInputForm';
import NoticeForm from '/imports/ui/common/NoticeForm';
import Spinner from '/imports/ui/common/Spinner';
import Copyright from '/imports/ui/common/Copyright';

import * as UserActions from '/imports/api/users/methods';
import * as TokenActions from '/imports/api/tokens/methods';

export default class ResetPasswordPage extends Component {
  constructor() {
    super();

    this.state = {
      loading: null,
      errors: null,
      tokenVerified: null
    };
  }

  _inputSubmit({inputValue}) {
    const password = inputValue;
    const tokenId = FlowRouter.getQueryParam("token");
    this.setState({
      loading: true
    });
    UserActions.resetPassword.call({tokenId, password}, (error) => {
      if (_.isEmpty(error)) {
        console.log(`token: ${tokenId} will be removed`);
        TokenActions.remove.call({tokenId});
        // redirect to user homepage
        FlowRouter.go('homePage');
      } else {
        this.setState({
          errors: error.reason
        });
      }
      this.setState({
        loading: false
      });
    });
  }

  componentWillMount() {
    const tokenId = FlowRouter.getQueryParam("token");
    console.log(tokenId);
    TokenActions.verify.call({tokenId}, (error) => {
      if (_.isEmpty(error)) {
        this.setState({
          tokenVerified: true
        });
      } else {
        this.setState({
          errors: error.reason,
          tokenVerified: false
        });
      }
    });
    if (tokenId) {
      // call verify Token
      this.setState({
        tokenVerified: true
      });
    } else {
      this.setState({
        tokenVerified: false
      });
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <Spinner
            message='Setting password ...'
          />
        </div>
      );
    }
    if (this.state.tokenVerified) {
      return (
        <div id="page-top">
          <div className="middle-box text-center loginscreen   animated fadeInDown">
            <div>
              <h1 className="logo-name">TL+</h1>
            </div>
            <h3>Enter your new password</h3>
            <SingleInputForm
              inputType='password'
              inputHolder='Password'
              buttonLabel='Reset'
              errors={ this.state.errors }
              onSubmit={ this._inputSubmit.bind(this) }
            />
            <Copyright />
          </div>
        </div>
      );
    } else {
      return (
        <div id="page-top">
          <NoticeForm
            code='404'
            message={ this.state.errors }
            description='Sorry, but the page you are looking for has note been found. Try checking the URL for error, then hit the refresh button on your browser or try found something else in our app.'
            buttonLabel='Come back to HomePage'
            redirectUrl='/'
          />
        </div>
      );
    }
  }
}