import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {FlowRouter} from 'meteor/kadira:flow-router';

import AliasForm from '/imports/ui/components/AliasForm';

// methods
import {isAliasExists} from '/imports/api/users/methods';
import {add as addAlias} from '/imports/api/alias/methods';

// utils
import {aliasValidator, googleTrackConversion} from '/imports/utils/index';
import {addSubdomain} from '/imports/utils/subdomain';
import {DOMAIN} from '/imports/startup/client/routes';


export class SignUpAliasNew extends Component {

  constructor() {
    super();

    this.state = {
      aliasAllowed: null,
      errors: null
    };
  };

  _inputSubmit({inputValue}) {
    const alias = inputValue;

    addAlias.call({alias}, (error, result) => {
      if (error) {
        this.setState({
          errors: error.reason
        });
      } else {
        addSubdomain({alias, route: FlowRouter.path('newSignUpSteps', {action: 'user'})});
      }
    });
  }

  _onKeyUp({inputValue}) {
    this.setState({
      aliasAllowed: false,
      errors: null
    });
    if (inputValue.length > 0) {
      if (aliasValidator(inputValue)) {
        isAliasExists.call({alias: inputValue}, (error, result) => {
          if (error) {
            this.setState({
              aliasAllowed: false,
              errors: error.reason
            });
          } else {
            const {exists} = result;
            if (exists) {
              this.setState({
                aliasAllowed: false,
                errors: `${inputValue}.${DOMAIN} is already taken. Please choose another one ...`
              });
            } else {
              this.setState({
                aliasAllowed: true,
                errors: null
              });
            }
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
    const
      {aliasAllowed, errors} = this.state;

    return (
      <div className="create-screen journey-box animated fadeInDown">
        <div className="row text-center">
          <h1>Create your alias</h1>
          <p>This alias will be used as your web address. Create your own domain in <strong>theLeader.io</strong> now
          </p>
          <AliasForm
            inputType='text'
            inputHolder='alias'
            buttonLabel='Create'
            aliasAllowed={aliasAllowed}
            errors={ errors }
            onSubmit={ this._inputSubmit.bind(this) }
            onKeyUp={ _.debounce(this._onKeyUp.bind(this), 300) }
          />
        </div>
      </div>
    );
  }
}