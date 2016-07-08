import React, {Component} from 'react';

import {DOMAIN, routes} from '/imports/startup/client/routes';

export default class SignInForm extends Component {

  _onSubmit() {
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    this.props.onSubmit({ email, password });
  }

  render() {
    const {
      signinTitle = `Welcome to theLeader.io`,
      errors = null
    } = this.props;
    const forgotPasswordUrl = `/${routes.password.forgot}`;
    const signUpUrl = `http://${DOMAIN}/${routes.signUp.user}`;
    return (
      
              <form className="m-t" role="form" onSubmit={(event) => {
                      event.preventDefault();
                      this._onSubmit();
                    }}>
                <div className="form-group">
                  <input ref="email" type="email" className="form-control" placeholder="Email address" required=""/>
                </div>
                <div className="form-group">
                  <input ref="password" type="password" className="form-control" placeholder="Password" required=""/>
                </div>
                <div className="form-group">
                  {!_.isEmpty(errors) && (
                    <p className="alert-danger text-center">{errors}</p>
                  )}
                </div>
                <button type="submit" className="btn btn-primary block full-width m-b">Sign in</button>

                <a href={forgotPasswordUrl}>
                  <small>Forgot password?</small>
                </a>

                <p className="text-muted text-center">
                  <small>Do not have an account?</small>
                </p>
                <a className="btn btn-sm btn-white btn-block" href={signUpUrl}>Create an account</a>
              </form>
              
    );
  }
}
