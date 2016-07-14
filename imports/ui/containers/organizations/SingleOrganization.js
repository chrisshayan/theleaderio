import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Organizations } from '/imports/api/organizations/index';
import * as Actions from '/imports/api/organizations/methods';

// import views
import Box from '/imports/ui/components/Box';
import FormInput from '/imports/ui/components/FormInput';
import HrDashed from '/imports/ui/components/HrDashed';

// import actions
import { setPageHeading, resetPageHeading } from '/imports/store/modules/pageHeading';

class SingleOrganization extends Component {

	state = {
		doc: {
			name: '',
			description: ''
		},
		error: {}
	}

	componentWillMount() {
		let title = 'Create new organization';
		if (this.props._id)
			title = 'Update organization';
		let breadcrumb = [{
			label: 'Organizations',
			route: FlowRouter.url('app.organizations')
		}, {
			label: title,
			active: true
		}];
		setPageHeading({ title, breadcrumb });
	}

	componentWillUnmount() {
		resetPageHeading();
	}

	componentWillReceiveProps(nextProps) {
		if (!_.isEqual(nextProps.doc, this.state.doc)) {
			const doc = {
				name: nextProps.doc.name || '',
				description: nextProps.doc.description || ''
			};
			this.setState({ doc });
		}
	}

	/**
	 * @event
	 * Form submit
	 */
	_onSubmit = e => {
		e.preventDefault();

		const { _id, onSave, onSaveSuccess } = this.props;
		let data = this.state.doc;

		// add _id to request data if this is update request
		if (_id) {
			data = {
				...data,
				_id
			};
		}

		onSave.call(data, (err, result) => {
			if (err) {
				let details = [];
				let error = {};
				try {
					if (err.details) {
						details = JSON.parse(err.details);
						_.each(details, e => error[e.name] = ' ');
					} else {
						error.GENERAL = err.reason;
					}
				} catch (e) {
					console.log(e)
				}

				this.setState({ error });
			} else {
				onSaveSuccess();
			}
		});
	}

	/**
	 * @event
	 * On click delete button
	 */
	_onClickDelete = e => {
		e.preventDefault();
		const { _id, onRemove, onSaveSuccess } = this.props;
		onRemove.call({ _id }, (err, result) => {
			if (err) {
				this.setState({ error: { GENERAL: err.reason } });
			} else {
				onSaveSuccess();
			}
		});
	}

	render() {
		const { doc, error } = this.state;
		const { _id, isLoading, onCancel } = this.props;
		if (isLoading) return <h1>Loading...</h1>;

		return (
			<div className="col-md-8">
				<Box title="Organization">
					<form onSubmit={this._onSubmit}>
						<FormInput 
							label="Name" 
							placeholder="name" 
							value={doc.name}
							onChangeText={name => this.setState({doc: {...doc, name}})}
							error={error.name}
						/>
						<HrDashed />
						<FormInput 
							label="Description" 
							placeholder="Description"
							value={doc.description}
							onChangeText={description => this.setState({doc: {...doc, description}})}
							error={error.description}
						/>
						<HrDashed />

						<div className="form-group">
							<div className="row">
								<div className="col-sm-4 col-sm-offset-1">
									{error.GENERAL && (
										<p className="text-danger">{ error.GENERAL }</p>
									)}
									<a className="btn btn-white" onClick={onCancel}>Cancel</a>
									{' '}
									<button className="btn btn-primary" type="submit">Save changes</button>
								</div>
								<div className="col-md-2 col-md-offset-3">
									{_id && (
										<a className="btn btn-danger" onClick={this._onClickDelete}>
											Delete Organization
										</a>
									)}
								</div>
							</div>
						</div>
					</form>
				</Box>
			</div>
		);
	}
}

const mapMeteorToProps = params => {
	let
		_id = params._id,
		type = 'insert',
		doc = {},
		isLoading = false,
		onSave = Actions.create,
		onSaveSuccess = () => {
			FlowRouter.go('app.organizations');
		},
		onCancel = () => {
			FlowRouter.go('app.organizations');
		},
		onRemove = () => null

	if (_id) {
		const sub = Meteor.subscribe('organizations.details', { _id });
		type = 'update';
		isLoading = !sub.ready();
		doc = Organizations.findOne(_id) || {};
		onSave = Actions.update;
		onRemove = Actions.remove;
	}

	return {
		_id,
		type,
		doc,
		isLoading,
		onSave,
		onSaveSuccess,
		onCancel,
		onRemove,
	};
}

export default createContainer(mapMeteorToProps, SingleOrganization);
