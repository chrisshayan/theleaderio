import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import {FlowRouter} from 'meteor/kadira:flow-router';

// components
import {Navigation} from '/imports/ui/common/NavigationNew';
import {TopNav} from '/imports/ui/common/TopNavNew';
import {Footer} from '/imports/ui/common/Footer';
import PageHeading from '/imports/ui/common/PageHeading';

import { Profiles } from '/imports/api/profiles';

// methods
import {verifyAdminRole} from '/imports/api/users/methods';

class MainLayoutComponent extends Component {
  constructor() {
    super();

    this.state = {
      isAdmin: false
    };
  }

  componentWillMount() {
    verifyAdminRole.call({userId: Meteor.userId()}, (error, result) => {
      if (!error) {
        this.setState({
          isAdmin: result.isAdmin
        });
      } else {
        this.setState({
          error: error.reason
        });
      }
    });
  }

  render() {
    const
      {content = () => null, activeRoute, pageHeading, currentUser, userProfile} = this.props,
      {isAdmin} = this.state
      ;

    return (
      <div id="wrapper">
        <Navigation
          activeRoute={activeRoute}
          isAdmin={isAdmin}
          userProfile={userProfile}
        />

        <div id="page-wrapper" className="gray-bg">
          <TopNav />

          {/* Show page heading IF title not null */}
          {pageHeading.title && <PageHeading {...pageHeading} />}

          {/* Main content */}
          <div className="wrapper wrapper-content">
            {content()}
          </div>

          <Footer/>
        </div>
      </div>
    );
  }
}

const meteorData = params => {

  var state = Meteor.AppState.get('pageHeading');
  return {
    activeRoute: FlowRouter.getRouteName(),
    pageHeading: state,
    currentUser: Meteor.user(),
    userProfile: Profiles.findOne({userId: Meteor.userId()})
  }
}

export const MainLayout = createContainer(meteorData, MainLayoutComponent);