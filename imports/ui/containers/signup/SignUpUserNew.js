import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {Accounts} from 'meteor/accounts-base';
import momentTZ from 'moment-timezone';
import {Session} from 'meteor/session';

// components
import FormInputHorizontal from '/imports/ui/components/FormInputHorizontal';
import CheckBox from '/imports/ui/components/CheckBox1';

// methods
import {initiateUserInformation} from '/imports/api/users/methods';
import {send as sendEmail} from '/imports/api/email/methods';
import {remove as removeAlias} from '/imports/api/alias/methods';

// functions
import {getSubdomain} from '/imports/utils/subdomain';
import {emailValidator} from '/imports/utils/index';

// constants
import {DOMAIN} from '/imports/startup/client/routes';

export class SignUpUserNew extends Component {

  constructor() {
    super();
    Session.set('email', 'tan.ktm@icarebenefits.com')

    this.state = {
      user: {
        firstName: "",
        lastName: "",
        email: Session.get('email') || "",
        alias: getSubdomain()
      },
      showPassword: false,
      errors: ""
    };
  };

  // componentWillUnmount() {
  //   // remove alias from blacklist
  //   removeAlias.call({alias});
  // }

  _onSubmit() {
    const
      {
        user: {firstName, lastName, email, alias: username}
      } = this.state,
      password = this.refs.password.value;
    ;

    if (_.isEmpty(firstName)) {
      this.setState({errors: `First name can't be empty.`});
      return;
    }
    if (_.isEmpty(email)) {
      this.setState({errors: `Email can't be empty.`});
      return;
    }
    if (_.isEmpty(password)) {
      this.setState({errors: `Password can't be empty.`});
      return;
    }
    if (!emailValidator(email)) {
      this.setState({errors: `Email ${email} is invalid.`});
      return;
    }

    // create user
    this.setState({
      loading: true,
      errors: null
    });
    Accounts.createUser({username, email, password}, (error) => {
      if (!error) {
        const
          userId = Accounts.userId()
        timezone = momentTZ.tz.guess() || Meteor.settings.public.localTimezone
        ;
        if (!_.isEmpty(userId)) {
          this.setState({
            loading: false,
            errors: null
          });
          this._onCreateUserSuccess({userId, email, alias: username, firstName, lastName, timezone});
        } else {
          // console.log(`user can't login`);
        }
      } else {
        if (error.reason === 'Username already exists.') {
          this.setState({
            loading: false,
            errors: 'Alias already exists.'
          });
        } else {
          this.setState({
            loading: false,
            errors: error.reason
          });
        }
      }
    });

  };

  _onCreateUserSuccess({userId, email, alias, firstName, lastName, timezone}) {
    // complete the creation user step
    initiateUserInformation.call({userId, email, alias, firstName, lastName, timezone}, (error, result) => {
      if (!error) {
        // generate new user data success

        if (!_.isEmpty(result)) {
          // send confirmation email to user
          const
            {tokenId} = result,
            verifyUrl = FlowRouter.path('newSignUpSteps', {action: 'confirm'}, {token: tokenId}),
            url = `http://${DOMAIN}${verifyUrl}`,
            template = 'welcome',
            data = {
              email: email,
              firstName: firstName,
              url: url
            };
          sendEmail.call({template, data});
        }

        // move to new user journey
        FlowRouter.go('app.journey', {step: 'organization'});
      } else {
        // can't generate new user data
        // console.log(`can't generate new user data`);
        this.setState({
          errors: error.reason
        });

        // remove user & alias
      }
    });
  }

  _onClickShowPassword() {
    const {showPassword} = this.state;
    this.setState({
      showPassword: !showPassword
    });
  }

  render() {

    const
      {user, errors, showPassword} = this.state,
      header = "Join theLeader.io today",
      description = "Being a true leader doesn’t come from a title, it is a designation you must earn from the people you lead."
      ;

    return (
      <div className="create-screen journey-box animated fadeInDown">
        <div className="row text-center">
          <h1>Join <strong>theLeader.io</strong> today</h1>
          <p>{description}</p>
          <form className="form-horizontal text-center"
                onSubmit={(event) => {
                  event.preventDefault();
                  this._onSubmit();
                }}
          >
            <FormInputHorizontal
              type="text"
              placeHolder="First name"
              grid={[0, 12]}
              defaultValue={user.firstName}
              onChangeText={firstName => this.setState({user: {...user, firstName}})}
              required={true}
              autoFocus={true}
            />
            <FormInputHorizontal
              type="text"
              placeHolder="Last name (optional)"
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
            <div className="form-group">
              <div className="col-md-12">
                <input ref="password" className="form-control" placeholder="Password" required={true}
                       type={showPassword ? "text" : "password"}
                />
              </div>
            </div>
            <div className="form-group text-left"
                 onClick={() => this.setState({showPassword: !showPassword})}
            >
              <div className="col-md-12">
                <CheckBox
                  label=" show password"
                  checked={showPassword}
                  onChange={value => this.setState({showPassword: value})}
                />
              </div>
            </div>

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