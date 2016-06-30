import {FlowRouter} from 'meteor/kadira:flow-router';
import React from 'react';
import {mount} from 'react-mounter';

import * as SubdomainActions from '/imports/utils/subdomain';
import NoticeForm from '/imports/ui/common/NoticeForm';
import MainLayout from '/imports/ui/layouts/MainLayout';
import LandingPage from '/imports/ui/containers/LandingPage';
import SignUpPage from '/imports/ui/containers/register/SignUpPage';
import CreateAliasPage from '/imports/ui/containers/register/CreateAliasPage';
import UserHomePage from '/imports/ui/containers/UserHomePage';
import SigninAliasPage from '/imports/ui/containers/authentication/SigninAliasPage';
import SignInPage from '/imports/ui/containers/authentication/SignInPage';
import PasswordPage from '/imports/ui/containers/authentication/PasswordPage';
import WelcomePage from '/imports/ui/containers/register/WelcomePage';
import ThankyouPage from '/imports/ui/containers/ThankyouPage';


/**
 * @summary lists of public routes
 * @route landingPage
 * @routes signupRouteGroup
 * @routes signinRouteGroup
 * @route forgotpassword
 * @route resetpassword
 */
const commonRoutes = FlowRouter.group({
  name: 'commonRouteGroup',
  prefix: '/'
});
// Landing Page Route
export const landingRoute = commonRoutes.route('/', {
  name: 'landingPage',
  triggersEnter: [
    () => {
      const subdomain = SubdomainActions.getSubdomain();
      if (subdomain !== undefined) {
        if(!_.isEmpty(Meteor.user()) | Meteor.loggingIn()) {
          FlowRouter.go(userHomeRoute.path);
        } else {
          FlowRouter.go(signinRoute.path);
        }
      }
    }
  ],
  action() {
    mount(LandingPage);
  }
});

export const welcomeRoute = FlowRouter.route('/welcome', {
  name: 'welcomePage',
  action() {
    mount(WelcomePage);
  }
});

export const thankyouRoute = FlowRouter.route('/thankyou', {
  name: 'thankyouPage',
  action() {
    mount(ThankyouPage);
  }
});

// Sign up Route Group
export const signupRoutes = FlowRouter.group({
  name: 'signupRouteGroup',
  prefix: '/signup'
});
// handling /signup root group
export const mainSignUp = signupRoutes.route('/', {
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
  action() {
    FlowRouter.go(signinRoute.path);
  }
});

// Sign in Route Group
export const signinRoutes = FlowRouter.group({
  name: 'signinRouteGroup',
  prefix: '/signin'
});
// handling signin alias group
export const signinAliasRoute = signinRoutes.route('/alias', {
  name: 'SigninAliasPage',
  action() {
    mount(SigninAliasPage);
  }
});
// handling signin root group
export const signinRoute = signinRoutes.route('/', {
  name: 'signin',
  action() {
    mount(SignInPage);
  }
});

// Password Route
export const passwordRoute = signinRoutes.route('/password/:action', {
  name: 'password',
  action() {
    mount(PasswordPage);
  }
});

/**
 * @summary lists of logged in Route (user have to login to access these route)
 * @route dashboard
 * @routes feedbacks
 * @route employees
 * @route measure
 */
export const loggedInRoutes = FlowRouter.group({
  name: 'loggedInRoutes'
});

export const userHomeRoute = loggedInRoutes.route('/dashboard', {
  name: 'dashboard',
  action() {
    mount(MainLayout, {
      content() {
        return <UserHomePage />;
      }
    });
  }
});

/**
 * @summary Default Invalid Url Route
 * @route notFound
 */
FlowRouter.notFound = mount(NoticeForm);
