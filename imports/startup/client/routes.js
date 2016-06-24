import { FlowRouter } from 'meteor/kadira:flow-router';
import React from 'react';
import {mount} from 'react-mounter';

import MainLayout from '/imports/ui/layouts/MainLayout';
import LandingPage from '/imports/ui/containers/LandingPage';
import SignUpPage from '/imports/ui/containers/SignUpPage';
import CreateAliasPage from '/imports/ui/containers/CreateAliasPage';
import UserHomePage from '/imports/ui/containers/UserHomePage';

FlowRouter.route('/', {
  name: 'landingPage',
  action() {
    mount(MainLayout, {
      content() {
        return <LandingPage />;
      }
    });
  }
});

const singupRouter = FlowRouter.group({
  prefix: '/signup',
  name: 'signup'
});

// handling /signup route
singupRouter.route('/', {
  name: 'signUpPage',
  action() {
    mount(SignUpPage);
  }
});

// handling /signup/alias route
singupRouter.route('/alias', {
  name: 'createAliasPage',
  action() {
    mount(CreateAliasPage);
  }
});

// handling /signup/firstTime/:userAlias route
singupRouter.route('/firstTime/:userAlias', {
  triggersEnter: [addSubdomain],
  action: function(params, queryParams) {
    console.log("Yeah! We are on the post:", FlowRouter.current().params.userAlias);
  }
});

FlowRouter.route('/dashboard', {
  name: 'UserHomePage',
  action() {
    mount(UserHomePage);
  }
});

function addSubdomain(context) {
  // context is the output of `FlowRouter.current()`
  const userAlias = context.params.userAlias;
  newUrl = `http://${userAlias}.devtheleader.io`;
  window.location = newUrl;
}


