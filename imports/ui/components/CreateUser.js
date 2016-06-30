import React, {Component} from 'react';
import Copyright from '/imports/ui/common/Copyright';

import { signinAliasRoute } from '/imports/startup/client/routes';

export default class CreateUser extends Component {

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

    return (
      <div className="middle-box text-center loginscreen   animated fadeInDown">
        <div>
          <h1 className="logo-name">TL+</h1>
        </div>
        <h3>
          Being a true leader doesn’t come from a title, it is a designation you must earn from the people you lead.</h3>
        <p>Become a good leader from today.</p>
        <form className="m-t" role="form" onSubmit={(event) => {
            event.preventDefault();
            this._onSubmit();
          }}>
          <div>
            <div className="form-group">
              <input ref="firstName" type="text" className="form-control" placeholder="First name" required=""/>
            </div>
            <div className="form-group">
              <input ref="lastName" type="text" className="form-control" placeholder="Last name" required=""/>
            </div>
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
            <button type="submit" className="btn btn-primary block full-width m-b">Sign up</button>
          </div>
          <p className="text-muted text-center">
            You are a leader already? <a href={signinAliasRoute.path}>Sign in.</a>
          </p>
        </form>
        <Copyright />
      </div>
    );
  }
}