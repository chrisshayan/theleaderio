import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import _ from 'lodash';

import SingleInputForm from '/imports/ui/common/SingleInputForm';
import Copyright from '/imports/ui/common/Copyright';
import * as SubdomainActions from '/imports/utils/subdomain';
import {userHomeRoute, routes} from '/imports/startup/client/routes';

export default class SigninAliasPage extends Component {
  constructor() {
    super();

    this.state = {
      errors: null
    };
  }

  componentWillMount() {
    // user signed in
    if(!_.isEmpty(Meteor.user())) {
      const subdomain = SubdomainActions.getSubdomain();
      const alias = Meteor.user().username;
      if(subdomain === alias) {
        // should route to user's dashboard
        FlowRouter.go(`${routes.home}`);
      }
    }
  }

  // submit for sign in to web address alias.theleader.io
  _inputSubmit({inputValue}) {
    const alias = inputValue;
    Meteor.logout();
    SubdomainActions.addSubdomain({ alias, route: routes.signIn.account});
  }

  render() {
    const {
      signinTitle = `Welcome to theLeader.io`,
      errors = null
    } = this.props;

    const signUpUrl = `/${routes.signUp.user}`;
    const forgotAliasUrl = `/${routes.alias.forgot}`;

    return (
      <div className="loginColumns animated fadeInDown">
        <div className="row">

          <div className="col-md-6">
            <h2 className="font-bold">{ signinTitle }</h2>
            <p>
              Please enter your alias.
            </p>
            <p>
              To become a truly great company it takes truly great leaders.
            </p>
            <p>
              <small>
                “A true leader has the confidence to stand alone, the courage to make tough decisions, and the compassion to listen to the needs of others. He does not set out to be a leader, but becomes one by the equality of his actions and the integrity of his intent.” —Douglas MacArthur
              </small>
            </p>
          </div>
          <div className="col-md-6">
            <div className="ibox-content">
              <h3 className="font-bold">Sign in to alias</h3>
              <SingleInputForm
                inputType='text'
                inputHolder='Alias'
                buttonLabel='Continue'
                errors={ this.state.errors }
                onSubmit={ this._inputSubmit.bind(this) }
              />
              <a href={forgotAliasUrl}>
                <small>Forgot your alias?</small>
              </a>
              <p className="text-muted text-center">
                <small>Do not have an account?</small>
              </p>
              <a className="btn btn-sm btn-white btn-block" href={signUpUrl}>Create an account</a>
              <Copyright />
            </div>
          </div>
        </div>
        <hr/>
      </div>
    );
  }
}