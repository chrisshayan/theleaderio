import { FlowRouter } from 'meteor/kadira:flow-router';
import React from 'react';
import {mount} from 'react-mounter';

import LandingPage from '/imports/ui/containers/LandingPage';

FlowRouter.route('/', {
  name: 'landingPage',
  action() {
    mount(LandingPage);
  }
});