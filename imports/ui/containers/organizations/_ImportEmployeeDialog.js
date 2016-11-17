import React, { Component } from 'react';
import { SkyLightStateless } from 'react-skylight';
import FormInput from '/imports/ui/components/FormInput';
import * as orgActions from '/imports/api/organizations/methods';
import { getErrors } from '/imports/utils';

import Dropzone from 'react-dropzone';
import Papa from 'papaparse';

const initialState = {
  file: null,
  error: {}
};

class ImportEmployeeDialog extends Component {
  state = initialState

  reset = () => {
    this.setState(initialState);
  }

  _onCancel = e => {
    e && e.preventDefault();
    this.reset();
    this.props.onDismiss && this.props.onDismiss();
  }

  _onDrop = files => {
    var file = files[0];

    if (file) {
      var employees = [];
      var reader = new FileReader();
      reader.onload = function() {
        Papa.parse(this.result, {
          header: true,
          skipEmptyLines: true,
          step: function(results, parser) {
            if (results.errors.length == 0) {
              _.each(results.data, function(item) {
                var employee = {
                  firstName: "",
                  lastName: "",
                  email: ""
                };
                var emailPat = /email/i;
                var firstNamePat = /first/i;
                var lastNamePat = /last/i;
                var namePat = /name/i;
                _.each(item, function(v, k) {
                  if (emailPat.test(k)) {
                    employee.email = v;
                  } else if (firstNamePat.test(k)) {
                    employee.firstName = v;
                  } else if (lastNamePat.test(k)) {
                    employee.lastName = v;
                  } else if (namePat.test(k)) {
                    employee.firstName = v;
                  }
                })
                if(employee.firstName && employee.email) {
                  employees.push(employee);
                }
              });
            }
          },
          complete: function(results, file) {
            // console.log(employees);
          }
        });
      };
      reader.readAsText(file);
    }
  }

  _onSave = e => {
    e.preventDefault();

  }

  render() {
    const { show, onDismiss, employeeId } = this.props;
    const { doc, error } = this.state;
    return (
      <SkyLightStateless
          isVisible={show}
          onCloseClicked={onDismiss}
          title={ 'Import employee' }
          dialogStyles={{zIndex: 9999}}
          beforeOpen={this.reset}
        >
        <form onSubmit={this._onSave}>
          <Dropzone multiple={false} onDrop={this._onDrop}>
            <h4>Click to select file or drag and drop to import.</h4>
            <p>Support .csv or .txt file</p>
          </Dropzone>
          <div className="form-group">
            <a href="#" className="btn btn-default" onClick={this._onCancel}>Cancel</a>
            {' '}
            <button className="btn btn-primary" onClick={this._onSave}>Save</button>
          </div>
        </form>
      </SkyLightStateless>
    );
  }
}

export default ImportEmployeeDialog;
