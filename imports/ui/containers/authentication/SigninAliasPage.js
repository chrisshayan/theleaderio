import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import _ from 'lodash';

import SingleInputForm from '/imports/ui/common/SingleInputForm';
import * as SubdomainActions from '/imports/utils/subdomain';
import {userHomeRoute, mainSignUp, passwordRoute} from '/imports/startup/client/routes';

export default class SigninAliasPage extends Component {
  constructor() {
    super();

    this.state = {
      errors: null
    };
  }

  componentWillMount() {
    if(!_.isEmpty(Meteor.user())) {
      const subdomain = SubdomainActions.getSubdomain();
      const alias = Meteor.user().username;
      if(subdomain === alias) {
        FlowRouter.go(userHomeRoute.path);
      }
    }
  }

  // submit for sign in to web address alias.theleader.io
  _inputSubmit({inputValue}) {
    const alias = inputValue;
    // for user login in a consistency state
    Meteor.logout();
    console.log(`suppose to change domain`);
    SubdomainActions.addSubdomain({ alias, route: 'signin'});
    // console.log(`go to route: ${signinRoute.path}`);
    // FlowRouter.go(signinRoute.path);
  }

  render() {
    const forgotAliasUrl = `${passwordRoute.path}/forgot`;
    return (
      <div>
        <SingleInputForm
          logoName='TL+'
          formTitle='Sign in to your web address'
          formDescription='Please enter you alias.'
          inputType='text'
          inputHolder='Alias'
          buttonLabel='Continue'
          errors={ this.state.errors }
          onSubmit={ this._inputSubmit.bind(this) }
        />
      </div>
    );
  }
}