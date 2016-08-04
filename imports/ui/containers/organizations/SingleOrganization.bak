import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import moment from 'moment';
import { Organizations } from '/imports/api/organizations';
import { Employees } from '/imports/api/employees';
import * as Actions from '/imports/api/organizations/methods';

// import views
import Box from '/imports/ui/components/Box';
import FormInput from '/imports/ui/components/FormInput';
import CheckBox from '/imports/ui/components/CheckBox';
import HrDashed from '/imports/ui/components/HrDashed';
import DatePicker from '/imports/ui/components/DatePicker';
import SingleOrganizationEmployees from '/imports/ui/components/SingleOrganizationEmployees';
import SingleOrganizationAddEmployee from '/imports/ui/components/SingleOrganizationAddEmployee';

// import actions
import { setPageHeading, resetPageHeading } from '/imports/store/modules/pageHeading';

class SingleOrganization extends Component {

	constructor(props) {
		super(props);

		// initial time
		const endTime = moment();
		const startTime = endTime.clone();
		startTime.subtract(1, 'year');

		this.state = {
			doc: {
				name: '',
				description: '',
				startTime: startTime.toDate(),
				endTime: endTime.toDate(),
				isPresent: false,
			},
			error: {},

			showAddDialog: false,
			employeeId: null,
		};

		// Setup page heading
		let title = 'Create new organization';
		if (props._id)
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
			const updateFields = ['name', 'description', 'startTime', 'endTime', 'isPresent'];
			const newDoc = _.pick(nextProps.doc, ...updateFields);
			const doc = _.extend(this.state.doc, newDoc);
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
			console.log(err, result)
			if (err) {
				let details = [];
				let error = {};
				try {
					if (err.details) {
						if(_.isObject(err.details)) {
							details = err.details;
						} else {
							details = JSON.parse(err.details);
						}
						_.each(details, e => error[e.name] = e.reason);
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

	_onClickShowDialog = e => {
		this.setState({showAddDialog: true});
	}

	_onDismissDialog = e => {
		this.setState({showAddDialog: false});
	}

	render() {
		const { doc, error } = this.state;
		const { _id, isLoading, onCancel, employees } = this.props;
		if (isLoading) return <h1>Loading...</h1>;

		return (
			<div className="col-md-9 col-sm-12 col-xs-12">
				<Box>
					<h2>Organization</h2>
					<div />
					<ul className="nav nav-tabs" style={{marginBottom: '20px'}}>
						<li className="active"><a data-toggle="tab" href="#tab-1"><i className="fa fa-info-circle"></i> Information</a></li>
            <li className=""><a data-toggle="tab" href="#tab-2"><i className="fa fa-users"></i> Employees</a></li>
          </ul>

          <div className="tab-content">
          	<div id="tab-1" className="tab-pane active">
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
								<div className="row">
									<div className="col-md-4">
										<DatePicker 
											label="Start time"
											option={{
												startView: 2,
												todayBtn: "linked",
												keyboardNavigation: false,
												forceParse: false,
												autoclose: true
											}}
											isDateObject={true}
											value={doc.startTime}
											error={error.startTime}
											onChange={startTime => this.setState({doc: {...doc, startTime}})}
										/>
									</div>
									<div className="col-md-4">
										<DatePicker 
											label="End time"
											option={{
												startView: 2,
												todayBtn: "linked",
												keyboardNavigation: false,
												forceParse: false,
												autoclose: true
											}}
											isDateObject={true}
											value={doc.endTime}
											error={error.endTime}
											disabled={doc.isPresent}
											onChange={endTime => this.setState({doc: {...doc, endTime}})}
										/>
									</div>
									<div className="col-md-4">
										<CheckBox
											label="Current organization"
											checked={doc.isPresent}
											onChange={isPresent => this.setState({doc: { ...doc, isPresent }})}
										/>
									</div>
								</div>
								<HrDashed />
								<div className="form-group">
									{ error.GENERAL && (
										<div className="row">
											<div className="col-sm-10 col-sm-offset-1">
												<p className="text-danger">{ error.GENERAL }</p>
											</div>
										</div>
									)}
									<div className="row">
										<div className="col-sm-4 col-sm-offset-1">
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
          	</div>

          	<div id="tab-2" className="tab-pane">
          		<div className="row">
          			<div className="col-md-9">
          				
          			</div>
          			<div className="col-md-3">
          				<button className="btn btn-primary btn-block" onClick={this._onClickShowDialog}>
          					<i className="fa fa-user-plus" />
          					{' '}
          					Add Employee
          				</button>
          			</div>
          		</div>
          		
          		<SingleOrganizationEmployees employees={employees} />
          	</div>
          </div>
				</Box>

				<SingleOrganizationAddEmployee 
					show={this.state.showAddDialog}
					onDismiss={this._onDismissDialog}
					organizationId={this.props._id}
					employeeId={this.state.employeeId}
				/>
			</div>
		);
	}
}

const mapMeteorToProps = params => {
	let
		_id = params._id,
		type = 'insert',
		doc = {},
		employees = [],
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
		if(!_.isEmpty(doc.employees)) {
			employees = Employees.find({_id: { $in: doc.employees }}).fetch()
		}

		onSave = Actions.update;
		onRemove = Actions.remove;
	}

	return {
		_id,
		type,
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
