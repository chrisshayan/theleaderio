import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import moment from 'moment';
import { Organizations } from '/imports/api/organizations';
import { Employees } from '/imports/api/employees';
import * as Actions from '/imports/api/organizations/methods';
import { getErrors } from '/imports/utils';

// import views
import Box from '/imports/ui/components/Box';
import Tabs from '/imports/ui/components/Tabs';
import FormInput from '/imports/ui/components/FormInput';
import CheckBox from '/imports/ui/components/CheckBox';
import HrDashed from '/imports/ui/components/HrDashed';
import DatePicker from '/imports/ui/components/DatePicker';
import SingleOrganizationEmployees from '/imports/ui/components/SingleOrganizationEmployees';
import SingleOrganizationAddEmployee from '/imports/ui/components/SingleOrganizationAddEmployee';

// import actions
import { setPageHeading, resetPageHeading } from '/imports/store/modules/pageHeading';
import OrganizationInfoForm from './_OrganizationInformationForm';

class SingleOrganization extends Component {
	state = {
		infoError: {}
	}
	/**
	 * on form submit on tab info
	 */
	_onFormSubmit = doc => {
		const { _id, onSave, onSaveSuccess, } = this.props;
		onSave.call(doc, (err, orgId) => {
			if(err) {
				this.setState({
					infoError: getErrors(err)
				});
			} else {
				onSaveSuccess(orgId);
			}
		});
	}

	getTabs() {
		const { _id, doc } = this.props;
		return [
			{
				key: 'info',
				title: 'Information',
				component: (
					<OrganizationInfoForm
						onSubmit={this._onFormSubmit}
						doc={doc}
						error={this.state.infoError}
					/>
				)
			},
			{
				key: 'employees',
				title: 'Employees',
				component: <h1>Form Employees</h1>,
				disabled: !_id
			},
		];
	}

	render() {
		const { currentTab } = this.props;
		return (
			<div className="col-md-9 col-sm-12 col-xs-12">
				<Box>
					<h2>Organization</h2>
					<div />
					<Tabs
						tabs={this.getTabs()}
						currentTab={currentTab}
						onChangeTab={t => {
							FlowRouter.setQueryParams({ t })
						}}
					/>
				</Box>
			</div>
		);
	}
}

const mapMeteorToProps = params => {
	let
		_id = params._id,
		currentTab = FlowRouter.getQueryParam('t') || 'info',
		doc = {},
		employees = [],
		isLoading = false,
		onSave = Actions.create,
		onSaveSuccess = (orgId) => {
			FlowRouter.go('app.organizations.update', {_id: orgId }, { t: 'employees' });
		},
		onCancel = () => {
			FlowRouter.go('app.organizations');
		},
		onRemove = () => null

	if (_id) {
		const sub = Meteor.subscribe('organizations.details', { _id });
		isLoading = !sub.ready();
		doc = Organizations.findOne(_id) || {};
		if(!_.isEmpty(doc.employees)) {
			employees = Employees.find({_id: { $in: doc.employees }}).fetch()
		}

		onSave = Actions.update;
		onSaveSuccess = () => null;
		onRemove = Actions.remove;
	}

	return {
		_id,
		currentTab,
		doc,
		employees,
		isLoading,
		onSave,
		onSaveSuccess,
		onCancel,
		onRemove,
	};
}

export default createContainer(mapMeteorToProps, SingleOrganization);
