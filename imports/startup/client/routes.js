import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import React from 'react';
import { mount } from 'react-mounter';

import NoticeForm from '/imports/ui/common/NoticeForm';
import WelcomePage from '/imports/ui/common/WelcomePage';
import ThankyouPage from '/imports/ui/common/ThankyouPage';
import Notification from '/imports/api/notifications/methods';

import ConfirmEmail from '/imports/ui/components/ConfirmEmail';

import MainLayout from '/imports/ui/layouts/MainLayout';
import BlankLayout from '/imports/ui/layouts/BlankLayout';

import LandingPage from '/imports/ui/containers/LandingPage';

import SignUpUser from '/imports/ui/containers/signup/SignUpUser';
import SignUpAlias from '/imports/ui/containers/signup/SignUpAlias';

import SignInAlias from '/imports/ui/containers/signin/SignInAlias';
import SignInAccount from '/imports/ui/containers/signin/SignInAccount';
import PasswordPage from '/imports/ui/containers/password/PasswordPage';
import SetPasswordPage from '/imports/ui/containers/password/SetPasswordPage';
import ForgotAliasPage from '/imports/ui/containers/alias/ForgotAliasPage';

import PublicProfile from '/imports/ui/containers/user/PublicProfile';
import Dashboard from '/imports/ui/containers/dashboard/Dashboard';
import Organizations from '/imports/ui/containers/organizations/Organizations';
import SingleOrganization from '/imports/ui/containers/organizations/SingleOrganization';
import Employees from '/imports/ui/containers/employees/Employees';
import EditProfile from '/imports/ui/containers/user/EditProfile';

import * as Notifications from '/imports/api/notifications/methods';

// Admin page
import ManageIndustries from '/imports/ui/containers/admin/ManageIndustries';

import { resetPageHeading } from '/imports/store/modules/pageHeading';
/**
 * Constant
 * @routes all routes in action
 * @DOMAIN application domain
 */

// this domain should get from settings
export const DOMAIN = 'devtheleader.io:9000';

/**
 * Change root url to make flow router understand subdomain
 */
FlowRouter.setRootUrl = (url) => {
  Meteor.absoluteUrl.defaultOptions.rootUrl = url || window.location.origin;
}

Tracker.autorun(function() {
  FlowRouter.watchPathChange();
  FlowRouter.setRootUrl();
});

// init root url - support subdomain
FlowRouter.setRootUrl();

export const routes = {
  home: '/',
  signUp: {
    user: 'signup/user',
    alias: 'signup/alias',
    verify: 'signup/verify'
  },
  signIn: {
    alias: 'signin/alias',
    account: 'signin/account'
  },
  password: {
    forgot: 'password/forgot',
    reset: 'password/reset',
    set: 'password/set'
  },
  alias: {
    forgot: 'alias/forgot'
  },
  thankyou: 'thankyou'

};

/**
 * @summary Default Invalid Url Route
 * @route notFound
 */
FlowRouter.notFound = {
  action() {
    mount(NoticeForm);
  }
};

FlowRouter.route('/not-found', {
  name: 'notFound',
  action() {
    mount(NoticeForm);
  }
});


/**
 * @summary lists of public routes
 * @route landingPage
 * @routes signupRouteGroup
 * @routes signinRouteGroup
 * @route forgotpassword
 * @route resetpassword
 */

const homeRoute = FlowRouter.route('/', {
  name: 'homePage',
  action() {
    const alias = Session.get('alias');
    if (alias) {
      mount(PublicProfile);
    } else {
      mount(LandingPage);
    }
  }
});

export const welcomeRoute = FlowRouter.route('/welcome', {
  name: 'welcomePage',
  action() {
    mount(Notification);
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
export const signUpRoutes = FlowRouter.group({
  name: 'signupRouteGroup',
  prefix: '/signup'
});
// handling /signup root group
signUpRoutes.route('/:action', {
  name: 'signUpPage',
  action(params, queryParams) {
    // create new user
    if (params.action == 'user') {
      mount(SignUpUser);
    }
    // create new alias
    if (params.action == 'alias') {
      mount(SignUpAlias);
    }
    // create new alias
    if (params.action == 'confirm') {
      mount(ConfirmEmail);
    }
  }
});

/**
 * @summary lists of signin routes
 * @route /signin/:action
 * @action alias
 * @action email
 */
const checkSignIn = (context, redirect) => {
  if(Meteor.isLoggingIn || Meteor.userId()) {
    FlowRouter.go('app.dashboard');
  }
}

export const signInRoutes = FlowRouter.group({
  name: 'signinRouteGroup',
  prefix: '/signin'
});
// handling signin alias group
signInRoutes.route('/:action', {
  name: 'SignInPage',
  action(params, queryParams) {
    // sign in to user's web address with alias
    if (params.action == 'alias') {
      mount(SignInAlias);
    }
    // sign in to user's account
    if (params.action == 'account') {
      if(Meteor.isLoggingIn || Meteor.userId()) {
        FlowRouter.go('app.dashboard');
      } else {
        mount(SignInAccount);
      }
    }
  }
});

/**
 * @summary lists of password routes
 * @route /password/:action
 * @action forgot
 * @action reset
 */
export const passwordRoutes = FlowRouter.group({
  name: 'passwordRouteGroup',
  prefix: '/password'
});
// handling signin alias group
passwordRoutes.route('/:action', {
  name: 'passwordPage',
  action(params) {
    // forgot password
    if (params.action == 'forgot') {
      mount(PasswordPage);
    }
    // reset password
    if (params.action == 'reset') {
      mount(PasswordPage);
    }
    // set password
    if (params.action == 'set') {
      mount(SetPasswordPage);
    }
  }
});


/**
 * @summary lists of alias routes
 * @route /alias/:action
 * @action forgot
 */
export const aliasRoutes = FlowRouter.group({
  name: 'aliasRouteGroup',
  prefix: '/alias'
});
// handling signin alias group
aliasRoutes.route('/:action', {
  name: 'aliasPage',
  action(params) {
    // forgot alias
    if (params.action == 'forgot') {
      mount(ForgotAliasPage);
    }
  }
});


/**************************************************
 * Main app routes
 **************************************************/

const requiredAuthentication = (context, redirect) => {
  if(!Meteor.isLoggingIn && !Meteor.userId()) {
    const alias = Session.get('alias');
    const params = { action: 'alias' };
    if(alias) {
      params.action = 'account';
    }
    FlowRouter.go('SignInPage', params);
  }
}


const appRoutes = FlowRouter.group({
  prefix: '/app',
  triggersEnter: [requiredAuthentication]
});

/**
 * Route: Logout
 */
appRoutes.route('/logout', {
  name: 'app.logout',
  action() {
    Meteor.logout(() => {
      const closeButton = false,
        timeOut = 2000,
        title = 'Signed out',
        message = ''
        ;
      Notifications.success.call({closeButton, timeOut, title, message});
      FlowRouter.go('/');
    });
  }
});

/**
 * Route: Dashboard
 */
appRoutes.route('/', {
  name: 'app.dashboard',
  action() {
    mount(MainLayout, {
      content() {
        return <Dashboard />
      }
    })
  }
});

/**
 * Route: Edit Profile
 */
appRoutes.route('/profile/:action', {
  name: 'app.profile.edit',
  action(params) {
    mount(MainLayout, {
      content() {
        if(params.action == 'edit') {
          return <EditProfile />
        }
      }
    })
  }
});


/**************************************************
 * Admin routes
 **************************************************/

const requiredAdminAuthentication = (context, redirect) => {

}

const adminRoutes = FlowRouter.group({
  prefix: '/admin',
  triggersEnter: [requiredAuthentication, requiredAdminAuthentication]
});

/**
 * Route: Dashboard
 */
adminRoutes.route('/industries', {
  name: 'admin.industries',
  action() {
    mount(MainLayout, {
      content() {
        return <ManageIndustries />
      }
    })
  }
});

/**
 * Route for organization
 *
 * This route can show leader's organizations
 */
appRoutes.route('/organizations', {
  name: 'app.organizations',
  action() {
    mount(MainLayout, {
      content() {
        return <Organizations />
      }
    })
  }
});

/**
 * Route for creating new organization
 */
appRoutes.route('/organizations/create', {
  name: 'app.organizations.create',
  action() {
    mount(MainLayout, {
      content() {
        return <SingleOrganization />
      }
    })
  }
});

/**
 * Route for updating an organization
 */
appRoutes.route('/organizations/update/:_id', {
  name: 'app.organizations.update',
  action(params) {
    mount(MainLayout, {
      content() {
        return <SingleOrganization _id={params._id} />
      }
    })
  }
});

/**
 * Route for manage employees
 */
appRoutes.route('/employees', {
  name: 'app.employees',
  action(params) {
    mount(MainLayout, {
      content() {
        return <Employees />
      }
    })
  }
});
