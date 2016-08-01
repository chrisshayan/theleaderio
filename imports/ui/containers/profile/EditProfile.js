import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

// components
import { setPageHeading, resetPageHeading } from '/imports/store/modules/pageHeading';
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


  render() {
    return (
      <div>
        <Box>
          <h2>Profile</h2>
          <div />
          <ul className="nav nav-tabs" style={{marginBottom: '20px'}}>
            <li className="active"><a data-toggle="tab" href="#tab-1"><i className="fa fa-info"></i>
              Information</a></li>
            <li className=""><a data-toggle="tab" href="#tab-2"><i className="fa fa-cog"></i>Preferences</a></li>
          </ul>

          <div className="tab-content">
            <div id="tab-1" className="tab-pane active">
              <ProfileInformationContainer />
            </div>
            <div id="tab-2" className="tab-pane">
              <ProfilePreferencesContainer />
            </div>
          </div>
        </Box>
      </div>
    );

  }
}
