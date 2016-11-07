import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';

// components
import SingleInputForm from '/imports/ui/common/SingleInputForm';
import NoticeForm from '/imports/ui/common/NoticeForm';
import Spinner from '/imports/ui/common/Spinner';
import Copyright from '/imports/ui/common/Copyright';

// methods
import * as UserActions from '/imports/api/users/methods';
import * as TokenActions from '/imports/api/tokens/methods';
import {getSubdomain} from '/imports/utils/subdomain';

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
    const
      password = inputValue,
      tokenId = FlowRouter.getQueryParam("token")
      ;
    this.setState({
      loading: true
    });
    UserActions.resetPassword.call({tokenId, password}, (error) => {
      if (_.isEmpty(error)) {
        const alias = getSubdomain();
        // console.log(`token: ${tokenId} will be removed`);
        TokenActions.remove.call({tokenId, action: 'password'});

        // login user automatically
        Meteor.loginWithPassword({username: alias}, password, (error) => {
          if(!error) {
            // redirect to user homepage
            FlowRouter.go('app.organizations');
          } else {
            this.setState({
              tokenVerified :false,
              errors: error.reason
            });
          }
        });
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
    TokenActions.verify.call({tokenId, action: 'password'}, (error) => {
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
    const
      {
        loading,
        tokenVerified,
        showPassword,
        errors
      } = this.state
      ;
    if (loading) {
      return (
        <div>
          <Spinner
            message='Setting password ...'
          />
        </div>
      );
    }
    if (tokenVerified) {
      return (
        <div id="page-top">
          <div className="middle-box text-center loginscreen animated fadeInDown">
            <div>
              <h1 className="logo-name">TL+</h1>
            </div>
            <h3>Enter your new password</h3>
            <SingleInputForm
              inputType={showPassword ? "text" : "password"}
              inputHolder='Password'
              havePasswordForm={true}
              buttonLabel='Reset'
              errors={ errors }
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
            message={ errors }
            description='Sorry, but the page you are looking for has note been found. Try checking the URL for error, then hit the refresh button on your browser or try found something else in our app.'
            buttonLabel='Come back to HomePage'
            redirectUrl='/'
          />
        </div>
      );
    }
  }
}