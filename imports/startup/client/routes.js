import { FlowRouter } from 'meteor/kadira:flow-router';
import React from 'react';
import {mount} from 'react-mounter';

import MainLayout from '/imports/ui/layouts/MainLayout';
import LandingPage from '/imports/ui/containers/LandingPage';
import SignUpPage from '/imports/ui/containers/SignUpPage';

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

FlowRouter.route('/signup', {
  name: 'signUpPage',
  action() {
    mount(SignUpPage);
  }
});
