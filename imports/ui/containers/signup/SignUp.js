import React, { Component } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

import {DOMAIN} from '/imports/startup/client/routes';
// components
import Spinner from '/imports/ui/common/Spinner';

import ConfirmEmail from '/imports/ui/components/ConfirmEmail';
import SignUpForm from '/imports/ui/components/SignUpForm';
import AliasForm from '/imports/ui/components/AliasForm';
import Copyright from '/imports/ui/common/Copyright';

// actions
import {verify as verifyAlias} from '/imports/api/users/methods';

export default class SignUp extends Component {
  constructor() {
    super();

    this.state = {
      loading: null,
      action: null,
      errors: null,
      aliasAllowed: null,
      userInfo: null
    };
  }

  componentWillMount() {
    // this.setState({loading: true});
    const action = FlowRouter.getParam('action');
    this.setState({ action });
    // if(!_.isEmpty(this.state.action)) {
    //   this.setState({loading: false});
    // }
  }

  // functions
  // collecting user data
  onSubmitUserInfo({firstName, lastName, email, password}) {
    this.setState({
      userInfo: {firstName, lastName, email, password},
      action: 'alias'
    });
    FlowRouter.setParams({ action: 'alias' });
  }

  _inputSubmit({inputValue}) {
    const alias = inputValue;
    // const {email} = this.state.userInfo;
    this.setState({ userInfo: { ...userInfo, alias}});
    console.log(this.state);
    // Call methods createAlias
    // UserActions.createAlias.call({email, alias}, (error) => {
    //   if (_.isEmpty(error)) {
    //     // Redirect to user's login page
    //     // Need the cookie sharing login information here
    //     this.setState({
    //       errors: null
    //     });
    //     // Sign out user before route to subdomain
    //     Meteor.logout();
    //     SubdomainActions.addSubdomain({alias, route: FlowRouter.path('SignInPage', {action: 'account'})});
    //   } else {
    //     this.setState({
    //       errors: error.reason
    //     });
    //   }
    // });
  }

  _onKeyUp({inputValue}) {
    this.setState({
      aliasAllowed: false,
      errors: null
    });
    if (inputValue.length > 0) {
      verifyAlias.call({alias: inputValue}, (error) => {
        if (!_.isEmpty(error)) {
          this.setState({
            aliasAllowed: true,
            errors: null
          });
        } else {
          this.setState({
            aliasAllowed: false,
            errors: `${inputValue}.${DOMAIN} is already taken. Please choose another one ...`
          });
        }
      });
    }
  }

  render() {
    const { loading, action, errors, userInfo } = this.state;
    if(loading) {
      return (
        <div>
          <Spinner />
        </div>
      );
    } else if(action == 'user') {
      return (
        <div className="middle-box text-center loginscreen animated fadeInDown">
          <div>
            <h1 className="logo-name">TL+</h1>
          </div>
          <h3>
            Being a true leader doesn’t come from a title, it is a designation you must earn from the people you lead.</h3>
          <p>Become a good leader from today.</p>
          <SignUpForm
            errors={this.state.errors}
            onSubmit={this.onSubmitUserInfo.bind(this)}
          />
          <Copyright />
        </div>
      );
    } else if(action == 'alias') {
      return (
        <div className="middle-box text-center loginscreen animated fadeInDown">
          <div>
            <h1 className="logo-name">TL+</h1>
          </div>
          <h3>Create your alias</h3>
          <p>This alias will be used as your web address.</p>
          <AliasForm
            inputType='text'
            inputHolder='alias'
            buttonLabel='Create'
            aliasAllowed={this.state.aliasAllowed}
            errors={ this.state.errors }
            onSubmit={ this._inputSubmit.bind(this) }
            onKeyUp={ this._onKeyUp.bind(this) }
          />
          <Copyright />
        </div>
      );
    } else if (action == 'confirm') {
      return (
        <div>
          <ConfirmEmail />
        </div>
      );
    }
  }
}