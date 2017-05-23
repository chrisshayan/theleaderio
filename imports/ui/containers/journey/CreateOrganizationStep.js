import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';

// components
import FormInputHorizontal from '/imports/ui/components/FormInputHorizontal';
import HrDashed from '/imports/ui/components/HrDashed';
import DatePicker from '/imports/ui/components/DatePicker';

// Methods
import {create, update} from '/imports/api/organizations/methods';

// Constants
import {DEFAULT_ORGANIZATION_PHOTO} from '/imports/utils/defaults';

export class CreateOrganizationStep extends Component {
  constructor() {
    super();
    this.state = {
      orgId: FlowRouter.getQueryParam("orgId") || "",
      org: {
        name: "",
        jobTitle: "",
        imageUrl: DEFAULT_ORGANIZATION_PHOTO || "",
        startTime: new Date(),
        endTime: new Date(),
        isPresent: true
      },
      errors: "",
    };
  }

  _onSubmit(event) {
    event && event.preventDefault();

    const {orgId, org} = this.state;
    // check if queryParams have orgId (user back to this step from other step)
    if (!_.isEmpty(orgId)) {
      // update org
      const
        {name, jobTitle} = this.state.org,
        _id = orgId
        ;
      // console.log({_id, name, jobTitle});
      update.call({_id, name, jobTitle}, (error, result) => {
        console.log({error, result})
        if (!error) {
          if (result) {
            FlowRouter.go("app.journey", {step: "employees"}, {orgId});
          } else {
            this.setState({
              errors: "Unable to edit organization!"
            });
          }
        } else {
          this.setState({
            errors: error.reason
          });
        }
      });
    } else {
      // create org
      create.call(org, (error, orgId) => {
        if (!error) {
          FlowRouter.go("app.journey", {step: "employees"}, {orgId});
        } else {
          this.setState({
            errors: error.reason
          });
        }
      });
    }
  }

  _onSkip() {
    // create default org with startDate is today and isPresent: true.
    const {name, jobTitle, startTime, endTime, imageUrl, isPresent} = this.state.org,
      doc = {
        name: "unnamed",
        jobTitle: "",
        startTime,
        endTime,
        imageUrl,
        isPresent
      }
      ;
    create.call(doc, (error, orgId) => {
      if (!error) {
        FlowRouter.go("app.journey", {step: "employees"}, {orgId});
      } else {
        this.setState({
          errors: error.reason
        });
      }
    });

    // get orgId and route to next page.
  }

  render() {
    const
      {orgId, org, errors} = this.state,
      disabled = !_.isEmpty(org.name) ? false : true
      ;
    return (
      <form className="form-horizontal" onSubmit={this._onSubmit.bind(this)}>
        <FormInputHorizontal
          label="Name"
          type="text"
          placeHolder="Organization name"
          grid={[2, 10]}
          defaultValue={org.name}
          onChangeText={name => this.setState({org: {...org, name}})}
          autoFocus={true}
        />
        <FormInputHorizontal
          label="Title"
          type="text"
          placeHolder="Job title"
          grid={[2, 10]}
          defaultValue={org.jobTitle}
          onChangeText={jobTitle => this.setState({org: {...org, jobTitle}})}
        />
        <HrDashed/>
        <div className="form-group pull-right">
          <a className="btn btn-white" onClick={this._onSkip.bind(this)}>Skip</a>
          {" "}
          <button className="btn btn-primary" type="submit"
                  style={{marginRight: 19}}
                  disabled={disabled}
          >Create{" "}<i className="fa fa-arrow-right"></i>
          </button>
        </div>
      </form>
    );
  }
}