import {FlowRouter} from 'meteor/kadira:flow-router';
import React from 'react';
import {mount} from 'react-mounter';

import * as UserActions from '/imports/api/users/methods';

import NoticeForm from '/imports/ui/common/NoticeForm';
import Spinner from '/imports/ui/common/Spinner';
import MainLayout from '/imports/ui/layouts/MainLayout';
import BlankLayout from '/imports/ui/layouts/BlankLayout';
import LandingPage from '/imports/ui/containers/LandingPage';
import SignUpPage from '/imports/ui/containers/register/SignUpPage';
import CreateAliasPage from '/imports/ui/containers/register/CreateAliasPage';
import WelcomePage from '/imports/ui/common/WelcomePage';
import ThankyouPage from '/imports/ui/common/ThankyouPage';
import UserProfilePage from '/imports/ui/containers/user/UserProfilePage';
import UserHomePage from '/imports/ui/containers/user/UserHomePage';
import SigninAliasPage from '/imports/ui/containers/authentication/SigninAliasPage';
import SignInPage from '/imports/ui/containers/authentication/SignInPage';
import PasswordPage from '/imports/ui/containers/authentication/PasswordPage';
import ResetPasswordPage from '/imports/ui/containers/authentication/ResetPasswordPage';
import ForgotAliasPage from '/imports/ui/containers/authentication/ForgotAliasPage';

/**
 * @summary lists of public routes
 * @route landingPage
 * @routes signupRouteGroup
 * @routes signinRouteGroup
 * @route forgotpassword
 * @route resetpassword
 */
// this domain should get from settings
export const DOMAIN = 'devtheleader.io:9000';

const commonRoutes = FlowRouter.group({
  name: 'commonRouteGroup',
  prefix: '/'
});
// Landing Page Route
export const homeRoute = commonRoutes.route('/', {
  name: 'landingPage',
  action() {
    const alias = Session.get('alias');
    if (alias !== undefined) {
      UserActions.verifyAlias.call({alias}, (error) => {
        if (_.isEmpty(error)) {
          mount(BlankLayout, {
            content() {
              return <UserProfilePage />;
            }
          });
        } else {
          FlowRouter.notFound;
        }
      });
    } else {
      mount(LandingPage);
    }
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
    mount(BlankLayout, {
      content() {
        return <SigninAliasPage />;
      }
    });
  }
});
// handling signin root group
export const signinRoute = signinRoutes.route('/', {
  name: 'signin',
  action() {
    const alias = Session.get('alias');
    if (alias !== undefined) {
      UserActions.verifyAlias.call({alias}, (error) => {
        if (_.isEmpty(error)) {
          mount(BlankLayout, {
            content() {
              return <SignInPage />;
            }
          });
        } else {
          FlowRouter.notFound;
        }
      });
    }
  }
});

// Password Route
export const passwordRoute = signinRoutes.route('/password/:action', {
  name: 'password',
  action() {
    mount(PasswordPage);
  }
});

// Reset Password Route
export const resetpasswordRoute = FlowRouter.route('/password/reset', {
  name: 'resetPassword',
  action() {
    mount(ResetPasswordPage);
  }
});

// Forgot Alias Route
export const forgotAliasRoute = FlowRouter.route('/alias/forgot', {
  name: 'forgotAlias',
  action() {
    mount(ForgotAliasPage);
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
  name: 'loggedInRoutes',
  triggersEnter: [() => {
    const alias = Session.get('alias');
    if (alias !== undefined) {
      UserActions.verifyAlias.call({alias}, (error) => {
        if (_.isEmpty(error)) {
          FlowRouter.route = FlowRouter.current();
        }
      });
    } else {
      FlowRouter.go(homeRoute.path);
    }
  }]
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
