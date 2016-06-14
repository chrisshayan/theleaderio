import { FlowRouter } from 'meteor/kadira:flow-router';
import React from 'react';
import {mount} from 'react-mounter';

import MainLayout from '/imports/ui/layouts/MainLayout';
import LandingPage from '/imports/ui/containers/LandingPage';

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