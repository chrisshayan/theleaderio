import React, {Component} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';

// component
import {CreateOrganizationStep} from './CreateOrganizationStep';
import {AddEmployeesStep} from './AddEmployeesStep';

export class GettingStartedJourney extends Component {
  render() {
    const
      step = FlowRouter.getParam("step")
      ;
    let
      header = "",
      description = "",
      content = () => null
      ;

    switch (step) {
      case 'organization': {
        header = "Create organization";
        description = "It is important to create your organization and upload your list of employees so theLeader.io will be able to get scores of different perspectives of your leadership.";
        content = () => {
          return <CreateOrganizationStep/>
        };
        break;
      }
      case 'employees': {
        header = "Add employees";
        description = "Upload your list of employees so theLeader.io will be able to get scores of different perspectives of your leadership. Engagement starts from this simple step.";
        content = () => {
          return <AddEmployeesStep/>
        };
        break;
      }
      default: {
        header = "Create organization";
        description = "It is important to create your organization and upload your list of employees so theLeader.io will be able to get scores of different perspectives of your leadership.";
        content = () => {
          return <CreateOrganizationStep/>
        };
      }
    }

    return (
      <div className="create-screen journey-box animated fadeInDown">
        <div className="row">
          <h1>{header}</h1>
          <p>{description}</p>
          {content()}
        </div>
      </div>
    );
  }
}