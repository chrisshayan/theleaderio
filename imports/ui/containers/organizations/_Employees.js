import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Organizations } from '/imports/api/organizations';
import * as orgActions from '/imports/api/organizations/methods';
import { Employees } from '/imports/api/employees';

import ScrollBox from 'react-scrollbar';
import Avatar from '/imports/ui/components/Avatar';
import SingleOrganizationAddEmployee from '/imports/ui/components/SingleOrganizationAddEmployee';
import SingleOrgEmployee from '/imports/ui/containers/organizations/_SingleOrgEmployee';

import Papa from 'papaparse';
import * as Notifications from '/imports/api/notifications/methods';


class OrganizationEmployees extends Component {
	state = {
		showAddDialog: false,
		showImportDialog: false,
		employeeId: null,
	}

	_onClickShowDialog = e => {
		this.setState({ showAddDialog: true });
	}

	_onDismissDialog = e => {
		this.setState({ showAddDialog: false });
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
								if (employee.firstName && employee.email) {
									employees.push(employee);
								}
							});
						}
					},
					complete: function(results, file) {
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
		this.setState({ showImportDialog: false });
	}

	render() {
		const { employees = [] } = this.props;
		return (
			<div>
				<div className="row">
    			<div className="col-md-7">
    				
    			</div>
    			<div className="col-md-2">
    				<button className="btn btn-default btn-block" onClick={this._onClickShowImportDialog}>
    					<i className="fa fa-cloud-upload" />
    					{' '}
    					Import (.csv)
    				</button>
    			</div>
    			<div className="col-md-3">
    				<button className="btn btn-primary btn-block" onClick={this._onClickShowDialog}>
    					<i className="fa fa-user-plus" />
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
    				<i className="fa fa-inbox" style={{fontSize: 50}} />
    				<h2>There is no employees</h2>
    			</div>
		)
	}

	<SingleOrganizationAddEmployee 
					show={this.state.showAddDialog}
					onDismiss={this._onDismissDialog}
					organizationId={this.props.orgId}
				/> < /div>
);
}
}

const styles = {
	valign: {
		verticalAlign: 'middle'
	}
};

const mapMeteorToProps = params => {
	const orgId = FlowRouter.getParam('_id');
	const sub = Meteor.subscribe('organizations.details', { _id: orgId });
	const org = Organizations.findOne({ _id: orgId });
	let employees = [];
	if (org && org.employees) {
		employees = Employees.find({ _id: { $in: org.employees } }).fetch();
	}
	return {
		isLoading: sub.ready(),
		orgId,
		employees,
	};
}

export default createContainer(mapMeteorToProps, OrganizationEmployees);
