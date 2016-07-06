import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {FlowRouter} from 'meteor/kadira:flow-router';

import Navigation from '/imports/ui/common/Navigation';
import TopNav from '/imports/ui/common/TopNav';

class MainLayout extends Component {
  render() {
    const {content = () => null, activeRoute} = this.props;
    console.log(activeRoute);
    return (
      <div id="wrapper">
        <Navigation activeRoute={activeRoute} />
        <div id="page-wrapper" className="gray-bg">
          <TopNav />
          <div className="wrapper wrapper-content">
            {content()}
          </div>
        </div>
      </div>
    );
  }
}

const meteorData = params => {
  return {
    activeRoute: FlowRouter.getRouteName(),
  }
}

export default createContainer(meteorData, MainLayout);