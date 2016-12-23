import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {FlowRouter} from 'meteor/kadira:flow-router';

// components
import FormInputHorizontal from '/imports/ui/components/FormInputHorizontal';
import HrDashed from '/imports/ui/components/HrDashed';
import NoticeForm from '/imports/ui/common/NoticeForm';

export class SignUpUserNew extends Component {

  constructor() {
    super();

    this.state = {
      user: {
        firstName: "",
        lastName: "",
        email: "",
        alias: ""
      },
      errors: ""
    };
  };

  _onSubmit() {
    console.log(`create user`);

  };

  _onSignUpWithGoogle() {
    console.log(`sign up with google.`);
  };

  _onCreateUserSuccess() {

  }

  render() {

    const
      {user, errors} = this.state,
      header = "Join theLeader.io today",
      description = "Being a true leader doesn’t come from a title, it is a designation you must earn from the people you lead."
      ;

    return (
      <div className="create-screen journey-box animated fadeInDown">
        <div className="row text-center">
          <h1>Join <strong>theLeader.io</strong> today</h1>
          <p>{description}</p>
          <HrDashed/>
          <form className="form-horizontal text-center"
                onSubmit={(event) => {
                  event.preventDefault();
                  this._onSubmit();
                }}
          >
            <div className="form-group">
              <div className="col-md-12">
                <a className="btn btn-danger btn-block"
                   onClick={this._onSignUpWithGoogle.bind(this)}
                >
                  <i className="fa fa-google"> </i> Sign up with Google
                </a>
              </div>
            </div>
            <div className="form-group text-center">Or sign up with your email address.</div>
            <FormInputHorizontal
              type="text"
              placeHolder="First name"
              grid={[0, 12]}
              defaultValue={user.firstName}
              onChangeText={firstName => this.setState({user: {...user, firstName}})}
              required={true}
            />
            <FormInputHorizontal
              type="text"
              placeHolder="Last name"
              grid={[0, 12]}
              defaultValue={user.lastName}
              onChangeText={lastName => this.setState({user: {...user, lastName}})}
            />
            <FormInputHorizontal
              type="email"
              placeHolder="Email address"
              grid={[0, 12]}
              defaultValue={user.email}
              onChangeText={email => this.setState({user: {...user, email}})}
              required={true}
            />
            {!_.isEmpty(errors) && (
              <div className="form-group">
                <p className="alert-danger text-center">{errors}</p>
              </div>
            )}
            <button className="btn btn-primary btn-block" type="submit">
              Sign up
            </button>
          </form>
        </div>
      </div>
    );
  }
}