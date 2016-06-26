import {FlowRouter} from 'meteor/kadira:flow-router';
import React from 'react';
import {mount} from 'react-mounter';

import InvalidUrlForm from '/imports/ui/common/InvalidUrlForm';
import * as SubdomainActions from '/imports/utils/subdomain';
import MainLayout from '/imports/ui/layouts/MainLayout';
import LandingPage from '/imports/ui/containers/LandingPage';
import SignUpPage from '/imports/ui/containers/register/SignUpPage';
import CreateAliasPage from '/imports/ui/containers/register/CreateAliasPage';
import UserHomePage from '/imports/ui/containers/UserHomePage';
import SignInPage from '/imports/ui/containers/authentication/SignInPage';

// Home route
const homeRoute = FlowRouter.route('/', {
  name: 'homeRoute',
  triggersEnter: [
    () => {
      const subdomain = SubdomainActions.getSubdomain();
      if (!_.isEmpty(Meteor.user())) {
        if (subdomain & subdomain == Meteor.user().username) {
          // user logged in correct & have correct url
          FlowRouter.go(userHomeRoute.path);
        } else {
          // logged in but connect wrong user or
          FlowRouter.go(signinRoute.path);
        }
      } else {
        if (subdomain) {
          console.log(`not logged in`);
          FlowRouter.go(signinRoute.path);
        } else {
          FlowRouter.go(landingRoute.path);
        }
      }
    }
  ]
});

const landingRoute = FlowRouter.route('/landing', {
  name: 'LandingPage',
  action() {
    mount(LandingPage);
  }
});

const signupRoutes = FlowRouter.group({
  prefix: '/signup',
  name: 'signup'
});

// handling /signup route
const mainSignUp = signupRoutes.route('/', {
  name: 'signUpPage',
  action() {
    mount(SignUpPage);
  }
});

// handling /signup/alias route
signupRoutes.route('/alias', {
  name: 'createAliasPage',
  action() {
    mount(CreateAliasPage);
  }
});

// handling /signup/firstTime/:userAlias route
// Still have problem with redirect user to new web address
// Can't login for user automatically
signupRoutes.route('/firstTime/:userAlias', {
  triggersExit: [ SubdomainActions.addSubdomain ],
  action() {
    FlowRouter.go(userHomeRoute.path);
  }
});


const signinRoute = FlowRouter.route('/signin', {
  name: 'signin',
  action() {
    mount(SignInPage);
  }
});

const loggedInRoutes = FlowRouter.group({
  name: 'loggedInRoutes'

});

const userHomeRoute = loggedInRoutes.route('/dashboard', {
  name: 'Dashboard',
  action() {
    mount(UserHomePage);
  }
});

FlowRouter.notFound = mount(InvalidUrlForm);
