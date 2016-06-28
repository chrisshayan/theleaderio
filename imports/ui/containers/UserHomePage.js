import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Profiles } from '/imports/api/profiles/index';
import * as SubdomainActions from '/imports/utils/subdomain';
import { signinRoute } from '/imports/startup/client/routes';

class UserHomePage extends Component {
  constructor() {
    super();

    this.state = {
      notification: null
    };
  }

  componentWillMount() {
    
  }

  render() {
    const { isLoading, profiles } = this.props;
    console.log(profiles);
    if(isLoading) {
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      );
    } else {
      return (
        <div>
          <h4>test</h4>
        </div>
      );
    }
  }
}

const meteorData = params => {
  const userId = Meteor.userId();
  const sub = Meteor.subscribe('profiles');
  console.log(`subscribe profiles: ${sub.ready()} & userId: ${userId}`);
  // if(!_.isEmpty(Meteor.user())) {
  //   const alias = SubdomainActions.getSubdomain();
  //   const username = Meteor.user().username;
  //   if(alias !== username) {
  //     // this.setState({
  //     //   notification: `Wrong user for domain ${document.location.hostname}`
  //     // });
  //     // console.log(this.state.notification);
  //     Meteor.logout();
  //     FlowRouter.go(signinRoute.path);
  //   }
  // }
  return {
    isLoading: (Meteor.loggingIn() & sub.ready()),
    profiles: Profiles.find().fetch()[0]
  }
};

export default createContainer(meteorData, UserHomePage);