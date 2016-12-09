import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {words as capitalize} from 'capitalize';

// collections
import {Organizations} from '/imports/api/organizations';
import {Employees} from '/imports/api/employees';
import {SendingPlans} from '/imports/api/sending_plans/index';

// methods
import * as orgActions from '/imports/api/organizations/methods';
import * as Notifications from '/imports/api/notifications/methods';

// components
import ScrollBox from 'react-scrollbar';
import Avatar from '/imports/ui/components/Avatar';
import SingleOrganizationAddEmployee from '/imports/ui/components/SingleOrganizationAddEmployee';
import SingleOrgEmployee from '/imports/ui/containers/organizations/_SingleOrgEmployee';

import Papa from 'papaparse';

// constants
import {TEMPLATE_IMPORT_EMPLOYEES} from '/imports/utils/defaults';

class OrganizationEmployees extends Component {
  state = {
    showAddDialog: false,
    showImportDialog: false,
    employeeId: null,
  }

  _onClickShowDialog = e => {
    this.setState({showAddDialog: true});
  }

  _onDismissDialog = e => {
    this.setState({showAddDialog: false});
  }

  _onClickShowImportDialog = e => {
    let img = document.createElement('input');
    img.type = 'file';
    img.multiple = false;
    img.onchange = (ev) => {
      let files = ev.target.files;
      if (files[0]) {
        const supportTypes = ['text/csv', 'text/plain'];
        if (_.indexOf(supportTypes, files[0].type) >= 0) {
          this.importEmployees(files[0]);
        } else {
          const
            closeButton = false,
            title = 'Error',
            message = 'CSV file is invalid';
          Notifications.error.call({
            closeButton,
            title,
            message
          });
        }
      }
    };
    img.click();
  }

  importEmployees = file => {
    if (file) {
      var organizationId = this.props.orgId;
      var employees = [];
      var reader = new FileReader();
      reader.onload = function () {
        Papa.parse(this.result, {
          header: true,
          skipEmptyLines: true,
          step: function (results, parser) {
            _.each(results.data, function (item) {
              var employee = {
                firstName: "",
                lastName: "",
                email: ""
              };
              var emailPat = /(email|E-mail|E-mail address)/i;
              var firstNamePat = /first/i;
              var lastNamePat = /last/i;
              var namePat = /name/i;
              _.each(item, function (v, k) {
                if (emailPat.test(k)) {
                  if (_.isEmpty(employee.email)) {
                    employee.email = v;
                  }
                } else if (firstNamePat.test(k)) {
                  if (_.isEmpty(employee.firstName)) {
                    employee.firstName = v;
                  }
                } else if (lastNamePat.test(k)) {
                  if (_.isEmpty(employee.lastName)) {
                    employee.lastName = v;
                  }
                } else if (namePat.test(k)) {
                  if (_.isEmpty(employee.firstName)) {
                    employee.firstName = v;
                  }
                }
              });
              if (employee.firstName && employee.email) {
                employees.push(employee);
              }
            });
          },
          complete: function (results, file) {
            if (employees.length) {
              orgActions.importEmployees.call({
                organizationId,
                employees
              }, err => {
                if (err) {

                } else {
                  const
                    closeButton = false,
                    title = 'Import Successfully',
                    message = '';
                  Notifications.success.call({
                    closeButton,
                    title,
                    message
                  });
                  window.trackEvent('import_employees', {
                    organization_id: organizationId,
                    total: employees.length
                  });
                }
              })
            } else {
              const
                closeButton = false,
                title = 'Error',
                message = 'There is no contact in your file';
              Notifications.error.call({
                closeButton,
                title,
                message
              });
            }
          }
        });
      };
      reader.readAsText(file);
    }
  }

  _onDismissImportDialog = e => {
    this.setState({showImportDialog: false});
  }

  render() {
    const {employees = [], plans = []} = this.props,
      editPlanUrl = FlowRouter.path('app.preferences', {}, {t: "schedule"}),
      [plan] = plans
      ;
    return (
      <div>
        <div className="row">
          {!_.isEmpty(plan) && (
            <div className="alert alert-info">
              <strong>{capitalize(plan.metric.toLowerCase())} survey</strong> will be sent on {moment(plan.sendDate).format("MMM Do, YYYY")}
              {' '}to all of your active employees. <a className="alert-link" href={editPlanUrl}>Edit your plan here.</a>
            </div>
          )}
          {!employees.length && (
            <div className="alert alert-warning">
              You have not added any employee yet. By uploading your list of employees <strong>theLeader.io</strong> will be able to get scores of different perspectives of your leadership.
              Engagement starts from this simple step.
            </div>
          )}
        </div>
        <div className="row">
          <div className="col-md-3 col-md-offset-3">
            <a className="btn btn-default btn-block" href={TEMPLATE_IMPORT_EMPLOYEES} target="_blank">
              <i className="fa fa-cloud-download"/>
              {' '}
              Download template
            </a>
          </div>
          <div className="col-md-3">
            <button className="btn btn-default btn-block" onClick={this._onClickShowImportDialog}>
              <i className="fa fa-cloud-upload"/>
              {' '}
              Import (.csv)
            </button>
          </div>
          <div className="col-md-3">
            <button className="btn btn-primary btn-block" onClick={this._onClickShowDialog}>
              <i className="fa fa-user-plus"/>
              {' '}
              Add Employee
            </button>
          </div>
        </div>

        { employees.length ? (
          <table className="table">
            <thead>
            <tr>
              <th>#</th>
              <th>First name</th>
              <th>Last name</th>
              <th width="40%">Email</th>
              <th>Status</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            { employees.map((employee, key) => (
              <SingleOrgEmployee
                key={key}
                position={key + 1}
                employee={employee}
                orgId={this.props.orgId}
              />
            ))}
            </tbody>
          </table>
        ) : (
          <div style={{
						width: '100%',
						border: '2px dashed #ddd',
						borderRadius: '6px',
						textAlign: 'center',
						margin: '20px 0',
						padding: '40px'
    			}}>
            <i className="fa fa-inbox" style={{fontSize: 50}}/>
            <h2>There is no employees</h2>
          </div>
        )
        }

        <SingleOrganizationAddEmployee
          show={this.state.showAddDialog}
          onDismiss={this._onDismissDialog}
          organizationId={this.props.orgId}
        /></div>
    );
  }
}

const styles = {
  valign: {
    verticalAlign: 'middle'
  }
};

const mapMeteorToProps = params => {
  const
    orgId = FlowRouter.getParam('_id'),
    sub = Meteor.subscribe('organizations.details', {_id: orgId}),
    subPlans = Meteor.subscribe('sendingPlans'),
    org = Organizations.findOne({_id: orgId}),
    leaderId = Meteor.userId()
    ;
  let employees = [], plans = [];
  if (org && org.employees) {
    employees = Employees.find({_id: {$in: org.employees}}).fetch();
  }
  if (leaderId) {
    plans = SendingPlans.find({leaderId, status: "READY"}, {
      sort: {sendDate: 1},
      limit: 1
    }).fetch();
  }
  return {
    isLoading: sub.ready() & subPlans.ready(),
    orgId,
    employees,
    plans
  };
}

export default createContainer(mapMeteorToProps, OrganizationEmployees);
