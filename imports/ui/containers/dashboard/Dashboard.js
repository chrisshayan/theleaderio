import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {FlowRouter} from 'meteor/kadira:flow-router';
import _ from 'lodash';

// methods
import {getPresentOrganizations} from '/imports/api/organizations/methods';
import * as Notifications from '/imports/api/notifications/functions';
import {measureMonthlyMetricScore} from '/imports/api/measures/methods';

// components
import {setPageHeading, resetPageHeading} from '/imports/store/modules/pageHeading';
import Spinner from '/imports/ui/common/Spinner';
import NoticeForm from '/imports/ui/common/NoticeForm';
import Tabs from '/imports/ui/components/Tabs';
import Box from '/imports/ui/components/Box';
import DashboardOrganizationContainer from '/imports/ui/containers/dashboard/DashboardOrganizationContainer';

// constants
const MAX_TABS = Meteor.settings.public.maxTabs;

export default class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      ready: false,
      error: "",
      orgList: [],
      currentTab: ""
    };
  }

  componentWillMount() {
    const
      leaderId = Meteor.userId(),
      date = new Date()
    ;

    setPageHeading({
      title: 'Dashboard',
      breadcrumb: [{
        label: 'Dashboard',
        route: FlowRouter.url('app.dashboard')
      }]
    });

    // get present organizations first
    getPresentOrganizations.call({leaderId: Meteor.userId(), isPresent: true}, (error, result) => {
      if (!error) {
        if (!_.isEmpty(result)) {
          this.setState({
            ready: true,
            orgList: _.orderBy(result, ['startTime'], ['desc'])
          });
        } else {
          // if no present organization, get all active organizations
          getPresentOrganizations.call({leaderId: Meteor.userId(), isPresent: false}, (error, result) => {
            if (!error) {
              this.setState({
                ready: true,
                orgList: _.orderBy(result, ['startTime'], ['desc'])
              });
            } else {
              this.setState({
                error: error.reason
              });
            }
          });
        }

      } else {
        this.setState({
          error: error.reason
        });
      }
    });
    // measure score of metric every time user access to dashboard
    measureMonthlyMetricScore.call({params: { leaderId, date}});
  }

  componentDidUpdate() {
    const {ready, orgList} = this.state;
    if (ready && orgList.length === 0) {
      const
        closeButton = true,
        title = "You didn't have present organization",
        message = "Please create one"
        ;
      Notifications.warning({closeButton, title, message});
      // FlowRouter.go('app.organizations');
      FlowRouter.go('app.journey', {step: 'organization'});
    }
  }

  getTabs({orgList}) {
    let tabs = [];

    orgList.map(org => {
      const tab = {
        key: org._id,
        title: org.name,
        component:
          <DashboardOrganizationContainer
            organizationId={org._id}
            haveCalendar={true}
        />
      };
      // allow maximum MAX_TABS tabs only
      if (tabs.length < MAX_TABS) {
        tabs.push(tab);
      }
    });
    return tabs;
  }

  componentWillUnmount() {
    resetPageHeading();
  }


  render() {
    const {ready, error} = this.state;
    if (!_.isEmpty(error)) {
      return (
        <div>
          <NoticeForm
            code='404'
            message={error}
            description='Sorry, but the page you are looking for has note been found. Try checking the URL for error, then hit the refresh button on your browser or try found something else in our app.'
            buttonLabel='Come back to HomePage'
            redirectUrl='/'
          />
        </div>
      );
    }

    if (ready) {
      const
        {currentTab, orgList} = this.state
        ;

      return (
        <div>
          <Box>
            <Tabs
              tabs={this.getTabs({orgList})}
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
    } else {
      return (
        <div>
          <Spinner />
        </div>
      );
    }
  }
}