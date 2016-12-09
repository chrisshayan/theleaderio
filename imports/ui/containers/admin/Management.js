import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {setPageHeading, resetPageHeading} from '/imports/store/modules/pageHeading';

// components
import Tabs from '/imports/ui/components/Tabs';
import Box from '/imports/ui/components/Box';
import ManageJobs from './ManageJobs';
import ManageIndustries from './ManageIndustries';
import Statistic from './StatisticContainer';
import ManageUsers from './ManageUsers';

export default class ManagementComponent extends Component {

  constructor() {
    super();

    this.state = {
      ready: false,
      error: "",
      currentTab: FlowRouter.getQueryParam('t') || ""
    };
  }

  componentWillMount() {
    setPageHeading({
      title: 'Admin',
      breadcrumb: [{
        label: 'Admin',
        active: true
      }]
    });
  }

  componentWillUnmount() {
    resetPageHeading();
  }

  getTabs() {
    const tabs = [
      {
        key: "Statistic",
        title: "Statistic",
        component: <Statistic/>
      },
      {
        key: "Users",
        title: "Users",
        component: <ManageUsers/>
      },
      {
        key: "Jobs",
        title: "Jobs",
        component: <ManageJobs/>
      },
      {
        key: "Industries",
        title: "Industries",
        component: <ManageIndustries/>
      }
    ];

    return tabs;
  }

  render() {
    const
    {currentTab} = this.state
    ;
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