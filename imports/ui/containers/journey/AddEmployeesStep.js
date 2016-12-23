import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {FlowRouter} from 'meteor/kadira:flow-router';
import Papa from 'papaparse';

// collections
import {Employees, STATUS_ACTIVE} from '/imports/api/employees/index';
import {Organizations} from '/imports/api/organizations/index';

// methods
import {addEmployee, importEmployees} from '/imports/api/organizations/methods';

// functions
import * as Notifications from '/imports/api/notifications/functions';

// components
import FormInputHorizontal from '/imports/ui/components/FormInputHorizontal';
import HrDashed from '/imports/ui/components/HrDashed';
import NoticeForm from '/imports/ui/common/NoticeForm';

class AddEmployeesStep extends Component {

  constructor() {
    super();

    this.state = {
      employee: {
        firstName: "",
        lastName: "",
        email: "",
        organizationId: FlowRouter.getQueryParam("orgId")
      },
      errors: "",
      showImportDialog: false,
      employeeId: null,
    };
  };

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
          Notifications.error({
            closeButton,
            title,
            message
          });
        }
      }
    };
    img.click();
  };

  importEmployees = file => {
    if (file) {
      var organizationId = FlowRouter.getQueryParam("orgId");
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
              importEmployees.call({
                organizationId,
                employees
              }, err => {
                if (err) {
                  this.setState({
                    errors: err.reason
                  });
                } else {
                  const
                    closeButton = false,
                    title = 'Import Successfully',
                    message = '';
                  Notifications.success({
                    closeButton,
                    title,
                    message
                  });
                  this._onGoNext();
                }
              })
            } else {
              const
                closeButton = false,
                title = 'Error',
                message = 'There is no contact in your file';
              Notifications.error({
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
  };

  _onDismissImportDialog = e => {
    this.setState({showImportDialog: false});
  };

  _onSubmit() {
    console.log(`add single employee.`);
    const {employee} = this.state;
    addEmployee.call(employee, (error) => {
      if (!error) {
        this.setState({
          employee: {
            firstName: "",
            lastName: "",
            email: "",
            organizationId: FlowRouter.getQueryParam("orgId")
          }
        });
        const
          closeButton = false,
          title = `Add employee ${employee.email}`,
          message = 'Success';
        Notifications.success({
          closeButton,
          title,
          message
        });
      } else {
        this.setState({errors: error.reason});
        console.log(error);
        const
          closeButton = false,
          title = `Add employee ${employee.email}`,
          message = 'Failed';
        Notifications.success({
          closeButton,
          title,
          message
        });
      }
    });
  };

  _onImportFromGoogle() {
    console.log(`import from google friend list.`);
  };

  _onGoNext() {
    console.log(`Go to next step`);
  };

  render() {

    const
      {employee, errors} = this.state,
      {ready, wrongUrl = false, disabled = true} = this.props
      ;

    console.log({employee, errors, ready, disabled})

    if (wrongUrl) {
      return (
        <NoticeForm/>
      );
    } else {
      if (ready) {
        return (
          <form className="form-horizontal text-center"
                onSubmit={(event) => {
                  event.preventDefault();
                  this._onSubmit();
                }}
          >
            <div className="form-group">
              <div className="col-md-12">
                <a className="btn btn-danger btn-block"
                   onClick={this._onImportFromGoogle.bind(this)}
                >
                  <i className="fa fa-cloud-upload"> </i> Import from Google
                </a>
              </div>
            </div>
            <div className="form-group">
              <div className="col-md-12">
                <a className="btn btn-white btn-block"
                   onClick={this._onClickShowImportDialog}
                >
                  <i className="fa fa-cloud-upload"> </i> Import from file (.csv)
                </a>
              </div>
            </div>
            <HrDashed/>
            <div className="text-center">Or add manually</div>
            <FormInputHorizontal
              type="text"
              placeHolder="First name"
              grid={[0, 12]}
              defaultValue={employee.firstName}
              onChangeText={firstName => this.setState({employee: {...employee, firstName}})}
              required={true}
            />
            <FormInputHorizontal
              type="text"
              placeHolder="Last name"
              grid={[0, 12]}
              defaultValue={employee.lastName}
              onChangeText={lastName => this.setState({employee: {...employee, lastName}})}
            />
            <FormInputHorizontal
              type="email"
              placeHolder="Email address"
              grid={[0, 12]}
              defaultValue={employee.email}
              onChangeText={email => this.setState({employee: {...employee, email}})}
              required={true}
            />
            <div className="form-group">
              {!_.isEmpty(errors) && (
                <p className="alert-danger text-center">{errors}</p>
              )}
            </div>
            <div className="form-group">
              <div className="col-md-3 col-md-offset-9">
                <button className="btn btn-success form-control" type="submit">
                  <i className="fa fa-plus"></i>{" "}Add
                </button>
              </div>
            </div>
            <HrDashed/>
            <div className="form-group pull-right">
              <button className="btn btn-primary"
                      onClick={this._onGoNext.bind(this)}
                      style={{marginRight: 19}}
                      disabled={disabled}
              >Go to next step{" "}<i className="fa fa-arrow-right"></i>
              </button>
            </div>
          </form>
        );
      } else {
        return (
          <div>
            Loading....
          </div>
        );
      }
    }
  }
}

export default AddEmployeesStepContainer = createContainer((params) => {
  const
    sub = Meteor.subscribe("employees"),
    subOrg = Meteor.subscribe("organizations"),
    leaderId = Meteor.userId(),
    organizationId = FlowRouter.getQueryParam("orgId"),
    ready = sub.ready() & subOrg.ready(),
    noOfEmployees = Employees.find({leaderId, status: STATUS_ACTIVE}).count(),
    noOfOrganizations = Organizations.find({_id: organizationId, leaderId}).count()
    ;

  return {
    ready,
    disabled: noOfEmployees > 0 ? false : true,
    wrongUrl: noOfOrganizations > 0 ? false : true
  };
}, AddEmployeesStep);