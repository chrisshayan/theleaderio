import React, {Component} from 'react';

import {routes} from '/imports/startup/client/routes';

export default class SignUpForm extends Component {

  _onSubmit() {
    const userProfile = {
      firstName: this.refs.firstName.value,
      lastName: this.refs.lastName.value,
      email: this.refs.email.value,
      password: this.refs.password.value
    };
    this.props.onSubmit(userProfile);
  }

  render() {

    this.propTypes = {
      onSubmit: React.PropTypes.func
    };

    const {errors} = this.props;

    const signInUrl = `/${routes.signIn.alias}`;

    return (
      <form className="m-t" role="form" onSubmit={(event) => {
            event.preventDefault();
            this._onSubmit();
          }}>
        <div>
          <div className="form-group">
            <input ref="firstName" type="text" className="form-control" placeholder="First name" required autofocus/>
          </div>
          <div className="form-group">
            <input ref="lastName" type="text" className="form-control" placeholder="Last name (optional)"/>
          </div>
          <div className="form-group">
            <input ref="email" type="email" className="form-control" placeholder="Email address" required/>
          </div>
          <div className="form-group">
            <input ref="password" type="password" className="form-control" placeholder="Password" required/>
          </div>
          <div className="form-group">
            {!_.isEmpty(errors) && (
              <p className="alert-danger text-center">{errors}</p>
            )}
          </div>
          <button type="submit" className="btn btn-primary block full-width m-b">Sign up</button>
        </div>
        <p>
          You are a leader already? <a href={signInUrl}>Sign in.</a>
        </p>
      </form>
    );
  }
}