import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Organizations } from '/imports/api/organizations';
import { actions as orgActions } from '/imports/store/modules/singleOrganization';
import moment from 'moment';
import { getErrors } from '/imports/utils';

// import actions
import { setPageHeading, resetPageHeading } from '/imports/store/modules/pageHeading';

// import views
import Box from '/imports/ui/components/Box';
import Tabs from '/imports/ui/components/Tabs';
import OrganizationInfoForm from './_OrganizationInformationForm';

class CreateOrganization extends Component {

	componentDidMount() {
		setPageHeading({
			title: 'Create new organization',
			breadcrumb: [{
				label: 'Organizations',
				route: FlowRouter.url('app.organizations')
			}, {
				label: 'create',
				active: true
			}]
		});
	}

	componentWillUnmount() {
		resetPageHeading();
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.success === true) {
			Meteor.AppState.dispatch(orgActions.reset());
			FlowRouter.go('app.organizations.update', {
				_id: nextProps._id
			}, { t : 'employees' });
		}
	}

	/**
	 * on form submit on tab info
	 */
	_onFormChange = doc => {
		Meteor.AppState.dispatch(orgActions.change(doc));
	}

	/**
	 * on form submit on tab info
	 */
	_onFormSubmit = doc => {
		const { onSave, onSaveSuccess, } = this.props;
		Meteor.AppState.dispatch(orgActions.create(doc));
	}

	getTabs() {
		const { onCancel, doc, error } = this.props;
		return [
			{
				key: 'info',
				title: 'Information',
				component: (
					<OrganizationInfoForm
						doc={doc}
						error={error}
						onChange={this._onFormChange}
						onSubmit={this._onFormSubmit}
						onCancel={onCancel}
					/>
				)
			},
			{
				key: 'employees',
				title: 'Employees',
				component: <h1></h1>,
				disabled: true
			},
		];
	}

	render() {
		return (
			<div className="col-md-11 col-sm-12 col-xs-12">
				<Box>
					<h2>Organization</h2>
					<div />
					<Tabs
						tabs={this.getTabs()}
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
	const state = Meteor.AppState.get('singleOrganization');
	let
		isLoading = false,
		onSave = () => null,
		onSaveSuccess = (orgId) => {
			FlowRouter.go('app.organizations.update', {_id: orgId }, { t: 'employees' });
		},
		onCancel = () => {
			FlowRouter.go('app.organizations');
		}

	return {
		_id: state.orgId,
		doc: state.doc,
		error: state.error,
		isLoading: !!state.loading,
		success: !!state.success,
		onSave,
		onSaveSuccess,
		onCancel
	};
}

export default createContainer(mapMeteorToProps, CreateOrganization);
