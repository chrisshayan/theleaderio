import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';

import {DOMAIN} from '/imports/startup/client/routes';
import AliasForm from '/imports/ui/components/AliasForm';
import Copyright from '/imports/ui/common/Copyright';
import * as UserActions from '/imports/api/users/methods';
import * as SubdomainActions from '/imports/utils/subdomain';

// utils
import {aliasValidator} from '/imports/utils/index';

export default class SignUpAlias extends Component {
  constructor() {
    super();

    this.state = {
      aliasAllowed: null,
      errors: null
    };
  }

  _inputSubmit({inputValue}) {
    const alias = inputValue;
    const email = Meteor.user().emails[0].address;
    // Call methods createAlias
    UserActions.createAlias.call({email, alias}, (error) => {
      if (_.isEmpty(error)) {
        // Redirect to user's login page
        // Need the cookie sharing login information here
        this.setState({
          errors: null
        });
        // Sign out user before route to subdomain
        Meteor.logout();
        SubdomainActions.addSubdomain({alias, route: FlowRouter.path('SignInPage', {action: 'account'})});
      } else {
        this.setState({
          errors: error.reason
        });
      }
    });

  }

  _onKeyUp({inputValue}) {
    this.setState({
      aliasAllowed: false,
      errors: null
    });
    if (inputValue.length > 0) {
      if(aliasValidator(inputValue)) {
        UserActions.verify.call({alias: inputValue}, (error) => {
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
      } else {
        this.setState({
          aliasAllowed: false,
          errors: "Please use only letters (a-z), numbers."
        });
      }
    }
  }

  render() {
    return (
      <div className="middle-box text-center loginscreen   animated fadeInDown">
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
          onKeyUp={ _.debounce(this._onKeyUp.bind(this), 300) }
        />
        <Copyright />
      </div>
    );
  }
}
