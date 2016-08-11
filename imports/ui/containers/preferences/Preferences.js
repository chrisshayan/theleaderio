import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

// components
import {setPageHeading, resetPageHeading} from '/imports/store/modules/pageHeading';
import Tabs from '/imports/ui/components/Tabs';
import Box from '/imports/ui/components/Box';

import EditProfileContainer from '/imports/ui/containers/profile/EditProfileContainer';
import CustomizePublicProfileContainer from '/imports/ui/containers/profile/CustomizePublicProfileContainer';
import SchedulerContainer from '/imports/ui/containers/scheduler/SchedulerContainer';

export default class Preferences extends Component {
  state = {
    currentTab: 'edit'
  };

  componentWillMount() {
    setPageHeading({
      title: 'Preferences',
      breadcrumb: [{
        label: 'Preferences',
        route: FlowRouter.url('app.preferences')
      }]
    })

    this.setState({
      currentTab: FlowRouter.getQueryParam('t')
    });
  }

  componentWillUnmount() {
    resetPageHeading();
  }

  getTabs() {
    const {onCancel, doc, error, isLoading} = this.props;
    return [
      {
        key: 'edit',
        title: 'Edit profile',
        component: <EditProfileContainer />
      },
      {
        key: 'customize',
        title: 'Customize public profile',
        component: <CustomizePublicProfileContainer />
      },
      {
        key: 'schedule',
        title: 'Schedule leadership process',
        component: <SchedulerContainer />
      }
    ];
  }


  render() {
    const {currentTab} = this.state;
    return (
      <div>
        <Box>
          <Tabs
            tabs={this.getTabs()}
            currentTab={currentTab}
            onChangeTab={t => {
							FlowRouter.setQueryParams({ t })
							this.setState({
                currentTab: FlowRouter.getQueryParam('t')
              });
						}}
          />
        </Box>
      </div>
    );

  }
}
