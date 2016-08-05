import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

// components
import { setPageHeading, resetPageHeading } from '/imports/store/modules/pageHeading';
import Tabs from '/imports/ui/components/Tabs';
import Box from '/imports/ui/components/Box';
import ProfileInformationContainer from '/imports/ui/containers/profile/ProfileInformationContainer';
import ProfilePreferencesContainer from '/imports/ui/containers/profile/ProfilePreferencesContainer';

export default class EditProfile extends Component {
  componentWillMount() {
    setPageHeading({
      title: 'Profile',
      breadcrumb: [{
        label: 'Profile',
        active: true
      }]
    })
  }

  componentWillUnmount() {
    resetPageHeading();
  }
  
  getTabs() {
    const { onCancel, doc, error, isLoading } = this.props;
    return [{
      key: 'info',
      title: 'Information',
      component: (
        <ProfileInformationContainer />
      )
    }, {
      key: 'preferences',
      title: 'Preferences',
      component: <ProfilePreferencesContainer />
    }, ];
  }


  render() {
    return (
      <div>
        <Box>
          <h2>Profile</h2>
          <Tabs
            tabs={this.getTabs()}
          />
        </Box>
      </div>
    );

  }
}
