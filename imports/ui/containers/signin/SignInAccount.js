import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import _ from 'lodash';

import Copyright from '/imports/ui/common/Copyright';
import Spinner from '/imports/ui/common/Spinner';
import NoticeForm from '/imports/ui/common/NoticeForm';
import SignInForm from '/imports/ui/components/SigninForm';

import * as SubdomainActions from '/imports/utils/subdomain';
import * as UserActions from '/imports/api/users/methods';

export default class SignInPage extends Component {
  constructor() {
    super();

    this.state = {
      alias: null,
      errors: null
    };
  }

  componentWillMount() {
    this.setState({
      loading: true
    });
    const alias = Session.get('alias');
    UserActions.verify.call({alias}, (error) => {
      if (_.isEmpty(error)) {
        this.setState({
          alias: true,
          loading: false
        });
      } else {
        this.setState({
          alias: false,
          loading: false
        });
      }
    });
  }

  // submit for sign in to subdomain
  onSubmit({email, password}) {
    this.setState({
      errors: null
    });
    Meteor.loginWithPassword({email}, password, (error) => {
      if (!_.isEmpty(error)) {
        this.setState({
          errors: error.reason
        });
      } else {
        if (!_.isEmpty(Meteor.user())) {
          const alias = Meteor.user().username;
          const subdomain = SubdomainActions.getSubdomain();
          if (subdomain === alias) {
            FlowRouter.go('homePage');
          } else {
            Meteor.logout();
            this.setState({
              errors: `${email} doesn't belong to ${document.location.hostname}`
            });
            // render or redirect to notification page which redirect to signin alias
            // FlowRouter.go(`/${routes.signIn.alias}`);
          }
        }
      }
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <Spinner
            message="Checking alias ..."
          />
        </div>
      );
    }
    if (this.state.alias) {
      const signinTitle = `Sign in to ${document.location.hostname}`;
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
                <SignInForm
                  signinTitle={ signinTitle }
                  errors={ this.state.errors }
                  onSubmit={ this.onSubmit.bind(this) }
                />
                <Copyright />
              </div>
            </div>
          </div>
        </div>
      );
    } else if (!this.state.alias) {
      return (
        <NoticeForm
          code='404'
          message="Alias doesn't exists"
          description='Sorry, but the page you are looking for has note been found. Try checking the URL for error, then hit the refresh button on your browser or try found something else in our app.'
          buttonLabel='Come back to HomePage'
        />
      );
    } else {
      return (
        <Spinner
          message="Loading ..."
        />
      );
    }
  }
}