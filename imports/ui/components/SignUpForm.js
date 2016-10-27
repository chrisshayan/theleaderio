import React, {Component} from 'react';
import CheckBox from '/imports/ui/components/CheckBox1';

export default class SignUpForm extends Component {

  constructor() {
    super();

    this.state = {
      showPassword: false
    };
  }

  _onSubmit() {
    const
      userProfile = {
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

    const
      {showPassword} = this.state,
      {errors} = this.props,
      signInUrl = FlowRouter.path('SignInPage', {action: 'alias'});

    return (
      <form className="m-t" role="form" onSubmit={(event) => {
            event.preventDefault();
            this._onSubmit();
          }}>
        <div>
          <div className="form-group">
            <input ref="firstName" type="text" className="form-control" placeholder="First name" required autoFocus/>
          </div>
          <div className="form-group">
            <input ref="lastName" type="text" className="form-control" placeholder="Last name (optional)"/>
          </div>
          <div className="form-group">
            <input ref="email" type="email" className="form-control" placeholder="Email address" required/>
          </div>
          <div className="form-group">
            <input ref="password" className="form-control" placeholder="Password" required
                   type={showPassword ? "text" : "password"}
            />
          </div>
          <div className="form-group text-left">
            <CheckBox
              label=" show password"
              checked={showPassword}
              onChange={value => this.setState({ showPassword: value })}
            />
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