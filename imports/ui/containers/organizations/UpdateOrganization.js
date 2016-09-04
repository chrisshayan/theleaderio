import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Organizations } from '/imports/api/organizations';
import * as orgMethods from '/imports/api/organizations/methods';
import { actions as orgActions } from '/imports/store/modules/singleOrganization';
import { getErrors } from '/imports/utils';

// import actions
import { setPageHeading, resetPageHeading } from '/imports/store/modules/pageHeading';

// import views
import Box from '/imports/ui/components/Box';
import Tabs from '/imports/ui/components/Tabs';
import LoadingIndicator from '/imports/ui/common/LoadingIndicator';
import Spinner from '/imports/ui/common/Spinner';

import OrganizationInfoForm from './_OrganizationInformationForm';
import OrganizationEmployees from './_Employees';

import * as Notifications from '/imports/api/notifications/methods';

class UpdateOrganization extends Component {
	static propTypes = {
		_id: PropTypes.string,
	}

	componentDidMount() {
		setPageHeading({
			title: 'Update organization',
			breadcrumb: [{
				label: 'Organizations',
				route: FlowRouter.url('app.organizations')
			}, {
				label: 'update',
				active: true
			}]
		});

		Meteor.AppState.dispatch(orgActions.fetchDetails(this.props._id));
	}

	componentWillUnmount() {
		Meteor.AppState.dispatch(orgActions.reset());
		resetPageHeading();
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
		orgActions.update(this.props._id, doc)
			.then(() => {
				Meteor.AppState.dispatch(orgActions.fetchDetails(this.props._id));
				const
					closeButton = false,
					title = 'Saved',
					message = '';
				Notifications.success.call({ closeButton, title, message });
			})
	}

	_onRemove = doc => {
		orgMethods.remove.call({ _id: doc._id }, err => {
			if(err) {
				Notifications.error.call({ message: err.reason });
			} else {
				FlowRouter.go('app.organizations');
				Notifications.success.call({ message: 'Removed' });
			}
		});
	}

	getTabs() {
		const { onCancel, doc, error, isLoading } = this.props;
		return [{
			key: 'info',
			title: 'Information',
			component: (
				<OrganizationInfoForm
					_id={doc._id}
					doc={doc}
					error={error}
					isLoading={isLoading}
					onChange={this._onFormChange}
					onSubmit={this._onFormSubmit}
					onCancel={onCancel}
					onRemove={this._onRemove}
				/>
			)
		}, {
			key: 'employees',
			title: 'Employees',
			component: <OrganizationEmployees />
		}, ];
	}

	render() {
		const { loaded, isLoading } = this.props;

		if (isLoading && !loaded) {
			return <Spinner />;
		}
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
						currentTab={this.props.currentTab}
					/>
				</Box>
			</div>
		);
	}
}

const mapMeteorToProps = params => {
	const _id = params._id;
	const state = Meteor.AppState.get('singleOrganization');
	let
		isLoading = false,
		currentTab = FlowRouter.getQueryParam('t') || 'info',
		onSave = () => null,
		onSaveSuccess = (orgId) => {
			FlowRouter.go('app.organizations.update', { _id: orgId }, { t: 'employees' });
		},
		onCancel = () => {
			FlowRouter.go('app.organizations');
		};

	return {
		_id,
		currentTab,
		doc: state.doc,
		error: state.error,
		loaded: state.loaded,
		isLoading: !!state.loading,
		success: !!state.success,
		onSave,
		onSaveSuccess,
		onCancel
	};
}

export default createContainer(mapMeteorToProps, UpdateOrganization);
