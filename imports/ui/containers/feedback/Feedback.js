import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {setPageHeading, resetPageHeading} from '/imports/store/modules/pageHeading';


// components
import Tabs from '/imports/ui/components/Tabs';
import Box from '/imports/ui/components/Box';
import FeedbackToLeaderContainer from '/imports/ui/containers/feedback/FeedbackToLeader';
import FeedbackToEmployeesContainer from '/imports/ui/containers/feedback/FeedbackToEmployees';

export default class Feedback extends Component {
  constructor(props) {
    super(props);
    setPageHeading({
      title: 'Feedback',
      breadcrumb: [{
        label: 'Feedback',
        active: true
      }]
    });

    Session.setDefault('FEEDBACK_TO_LEADER_PAGE', 1);
    Session.setDefault('FEEDBACK_TO_EMPLOYEES_PAGE', 1);

    this.state = {
      ready: false,
      error: "",
      currentTab: FlowRouter.getQueryParam('t') || ""
    };
  }

  componentWillUnmount() {
    resetPageHeading();
  }


  getTabs() {
    let tabs = [
      {
        key: "toLeader",
        title: "To Leader",
        component: <FeedbackToLeaderContainer/>
      },
      {
        key: "toEmployees",
        title: "To Employees",
        component: <FeedbackToEmployeesContainer/>
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