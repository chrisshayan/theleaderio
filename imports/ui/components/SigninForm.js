import React, {Component} from 'react';

import Copyright from '/imports/ui/common/Copyright';
import {passwordRoute, mainSignUp} from '/imports/startup/client/routes';

export default class Signin extends Component {

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
    const forgotPasswordUrl = `${passwordRoute.path}/forgot`;
    return (
      <div className="loginColumns animated fadeInDown">
        <div className="row">

          <div className="col-md-6">
            <h2 className="font-bold">{ signinTitle }</h2>
            <p>
              Leadership is the key to success. A good leadership not only will help businesses to move up and become successful but also helps to empower the employees which will foster innovation and employee engagement.
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
                <a className="btn btn-sm btn-white btn-block" href={mainSignUp.path}>Create an account</a>
              </form>
              <Copyright />
            </div>
          </div>
        </div>
        <hr/>
      </div>
    );
  }
}