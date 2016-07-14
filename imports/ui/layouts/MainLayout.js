import { Meteor } from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {FlowRouter} from 'meteor/kadira:flow-router';

import Navigation from '/imports/ui/common/Navigation';
import TopNav from '/imports/ui/common/TopNav';
import PageHeading from '/imports/ui/common/PageHeading';

class MainLayout extends Component {
  render() {
    const {content = () => null, activeRoute, pageHeading} = this.props;
    return (
      <div id="wrapper">
        <Navigation activeRoute={activeRoute} />
        <div id="page-wrapper" className="gray-bg">
          <TopNav />

          {/* Show page heading IF title not null */}
          {pageHeading.title && <PageHeading {...pageHeading} />}

          {/* Main content */}
          <div className="wrapper wrapper-content">
            {content()}
          </div>
        </div>
      </div>
    );
  }
}

const meteorData = params => {
  var state = Meteor.AppState.get('pageHeading');
  return {
    activeRoute: FlowRouter.getRouteName(),
    pageHeading: state
  }
}

export default createContainer(meteorData, MainLayout);