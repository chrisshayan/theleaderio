import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import _ from 'lodash';

import AliasForm from '/imports/ui/components/AliasForm';
import Copyright from '/imports/ui/common/Copyright';
import * as UserActions from '/imports/api/users/methods';
import * as SubdomainActions from '/imports/utils/subdomain';
import {userHomeRoute, DOMAIN, routes} from '/imports/startup/client/routes';

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
        FlowRouter.go('homePage');
      }
    }
  }

  // submit for sign in to web address alias.theleader.io
  _inputSubmit({inputValue}) {
    const alias = inputValue;
    Meteor.logout();
    SubdomainActions.addSubdomain({ alias, route: FlowRouter.path('SignInPage', {action: 'account'})});
  }

  _onKeyUp({inputValue}) {
    this.setState({
      aliasAllowed: false,
      errors: null
    });
    if(inputValue.length > 0) {
      UserActions.verify.call({alias: inputValue}, (error) => {
        if(_.isEmpty(error)) {
          this.setState({
            aliasAllowed: true,
            errors: null
          });
        } else {
          this.setState({
            aliasAllowed: false,
            errors: `${inputValue}.${DOMAIN} doesn't exists. Please enter the correct one ...`
          });
        }
      });
    }
  }

  render() {
    const {
      signinTitle = `Welcome to theLeader.io`,
      errors = null
    } = this.props;

    const signUpUrl = FlowRouter.path('signUpPage', {action: 'user'});
    const forgotAliasUrl = FlowRouter.path('aliasPage', {action: 'forgot'});

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
              <h3 className="font-bold">Sign in to your web address:</h3>
              <AliasForm
                inputType='text'
                inputHolder='alias'
                buttonLabel='Continue'
                aliasAllowed={this.state.aliasAllowed}
                errors={ this.state.errors }
                onSubmit={ this._inputSubmit.bind(this) }
                onKeyUp={ this._onKeyUp.bind(this) }
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