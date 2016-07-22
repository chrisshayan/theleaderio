import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

// components
import Box from '/imports/ui/components/Box';
import EditProfileContainer from '/imports/ui/containers/profile/EditProfileContainer';
import ConfigProfileContainer from '/imports/ui/containers/profile/ConfigProfileContainer';

export default class Profile extends Component {
  render() {
    return (
      <div>
        <Box>
          <h2>Profile</h2>
          <div />
          <ul className="nav nav-tabs" style={{marginBottom: '20px'}}>
            <li className="active"><a data-toggle="tab" href="#tab-1"><i className="fa fa-info"></i>
              Information</a></li>
            <li className=""><a data-toggle="tab" href="#tab-2"><i className="fa fa-cog"></i>Configurations</a></li>
          </ul>

          <div className="tab-content">
            <div id="tab-1" className="tab-pane active">
              <EditProfileContainer />
            </div>
            <div id="tab-2" className="tab-pane">
              <ConfigProfileContainer />
            </div>
          </div>
        </Box>
      </div>
    );

  }
}
