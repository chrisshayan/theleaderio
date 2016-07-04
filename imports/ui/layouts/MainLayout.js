import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {FlowRouter} from 'meteor/kadira:flow-router';

import Navigation from '/imports/ui/common/Navigation';
import TopNav from '/imports/ui/common/TopNav';

class MainLayout extends Component {
  render() {
    const { content = () => null, activeRoute } = this.props;
    console.log(activeRoute);
    return (
      <div>
        <div className="content-wrapper">
          <TopNav />
          <div style={{padding: 20}}>
            {content()}
          </div>
        </div>

        <Navigation activeRoute={activeRoute} />
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