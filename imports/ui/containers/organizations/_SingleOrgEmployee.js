import React, { Component } from 'react';
import FormInput from '/imports/ui/components/FormInput';
import XEditable from '/imports/ui/components/XEditable';

import { STATUS_ACTIVE, STATUS_DEACTIVE } from '/imports/api/employees';
import * as orgActions from '/imports/api/organizations/methods';
class SingleOrgEmployee extends Component {
  state = {
    isEditing: false,
  }

  _onToggleEditMode = e => {
    this.setState({
      isEditing: !this.state.isEditing
    });
  }

  _onRemove = e => {
    e.preventDefault();
    const t = confirm('Are you sure you want to delete this employee?');
    if (t) {
      var snapshot = _.clone(this.props.employee);
      orgActions.removeEmployee.call({ employeeId: this.props.employee._id }, err => {
        if (!err) {
          window.trackEvent('remove_employee', {
            organization_id: this.props.orgId,
            employee_id: snapshot._id,
            name: [snapshot['firstName'], snapshot['lastName']].join(' '),
            email: snapshot['email']
          });
        }
      })
    }
  }

  _onDeactive = e => {
    e.preventDefault();
    const data = {
      employeeId: this.props.employee._id,
      status: STATUS_DEACTIVE
    };
    orgActions.toggleStatusEmployee.call(data, err => {
      if (!err) {
        window.trackEvent('deactive_employee', {
          organization_id: this.props.orgId,
          employee_id: this.props.employee._id
        });
      }
    });
  }

  _onActive = e => {
    e.preventDefault();

    const data = {
      employeeId: this.props.employee._id,
      status: STATUS_ACTIVE
    };
    orgActions.toggleStatusEmployee.call(data, err => {
      if (!err) {
        window.trackEvent('active_employee', {
          organization_id: this.props.orgId,
          employee_id: this.props.employee._id
        });
      }
    });
  }

  render() {
    const { position = '', employee, orgId } = this.props;

    return (
      <tr>
				<td style={styles.valign}>{ position }</td>
        <td style={styles.valign}>
			  	<XEditable
			  		key={employee._id + '_first_name'}
			  		placeholder="First name"
			  		valueName="value"
			  		value={employee.firstName}
			  		method="employees.updateSingleField"
			  		selector={{organizationId: orgId, employeeId: employee._id, field: 'firstName'}}
			  	/>
      	</td>
        <td style={styles.valign}>
			  	<XEditable
			  		key={employee._id + '_last_name'}
			  		placeholder="Last name"
			  		valueName="value"
			  		value={employee.lastName}
			  		method="employees.updateSingleField"
			  		selector={{organizationId: orgId, employeeId: employee._id, field: 'lastName'}}
			  	/>
      	</td>
        <td style={styles.valign}>
			  	<XEditable
			  		key={employee._id + '_email'}
			  		placeholder="Email"
			  		valueName="value"
			  		value={employee.email}
			  		method="employees.updateSingleField"
			  		selector={{organizationId: orgId, employeeId: employee._id, field: 'email'}}
			  	/>
        </td>
        <td className="client-status" style={styles.valign}>
        	{ employee.status == STATUS_ACTIVE ? (
        		<span className="label label-primary">active</span>
        	) : (
        		<span className="label label-default">deactive</span>
        	)}
        </td>
        <td style={styles.valign}>
					<div className="btn-group">
					  <button style={{marginBottom: 0}} data-toggle="dropdown" className="btn btn-default btn-xs dropdown-toggle">
					  	Action <span className="caret"></span>
					  </button>
					  <ul className="dropdown-menu">
					  	{ employee.status == STATUS_ACTIVE ? (
					  		<li><a href="#" onClick={this._onDeactive}> <i className="fa fa-lock" /> Deactive</a></li>
					  	) : (
					  		<li><a href="#" onClick={this._onActive}> <i className="fa fa-unlock" /> Active</a></li>
					  	)}
					    <li><a href="#" onClick={this._onRemove}><i className="fa fa-trash" /> Remove</a></li>
					  </ul>
					</div>

      	</td>
      </tr>
    );
  }
}

const styles = {
  valign: {
    verticalAlign: 'middle'
  }
};

export default SingleOrgEmployee;
