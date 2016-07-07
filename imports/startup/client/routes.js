import {FlowRouter} from 'meteor/kadira:flow-router';
import React from 'react';
import {mount} from 'react-mounter';

import * as UserActions from '/imports/api/users/methods';

import NoticeForm from '/imports/ui/common/NoticeForm';
import WelcomePage from '/imports/ui/common/WelcomePage';
import ThankyouPage from '/imports/ui/common/ThankyouPage';

import MainLayout from '/imports/ui/layouts/MainLayout';
import BlankLayout from '/imports/ui/layouts/BlankLayout';

import LandingPage from '/imports/ui/containers/LandingPage';

import SignUpUser from '/imports/ui/containers/signup/SignUpUser';
import SignUpAlias from '/imports/ui/containers/signup/SignUpAlias';

import SignInAliasPage from '/imports/ui/containers/signin/SignInAliasPage';
import SignInPage from '/imports/ui/containers/signin/SignInPage';
import PasswordPage from '/imports/ui/containers/signin/PasswordPage';
import ResetPasswordPage from '/imports/ui/containers/signin/ResetPasswordPage';
import ForgotAliasPage from '/imports/ui/containers/signin/ForgotAliasPage';

import PublicProfilePage from '/imports/ui/containers/user/PublicProfilePage';
import UserHomePage from '/imports/ui/containers/user/HomePage';

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
    if (alias) {
      mount(PublicProfilePage);
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

/**
 * @summary lists of signup routes
 * @route /signup/:action
 * @action user
 * @action alias
 */
export const signupRoutes = FlowRouter.group({
  name: 'signupRouteGroup',
  prefix: '/signup'
});
// handling /signup root group
export const mainSignUp = signupRoutes.route('/:action', {
  name: 'signUpPage',
  action(params, queryParams) {
    // create new user
    if(params.action == 'user') {
      mount(SignUpUser);
    }
    // create new alias
    if(params.action == 'alias') {
      if(queryParams.token) {
        mount(SignUpAlias);
      }
    }
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
        return <SignInAliasPage />;
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
