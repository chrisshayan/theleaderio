import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

// views
import FormInput from '/imports/ui/components/FormInput';
import CheckBox from '/imports/ui/components/CheckBox';
import HrDashed from '/imports/ui/components/HrDashed';
import DatePicker from '/imports/ui/components/DatePicker';


class OrganizationForm extends Component {
	constructor(props) {
		super(props);

		// initial time
		const endTime = moment();
		const startTime = endTime.clone();
		startTime.subtract(1, 'year');

		this.state = {
			doc: {
				name: '',
				jobTitle: '',
				description: '',
				startTime: startTime.toDate(),
				endTime: endTime.toDate(),
				isPresent: false,
			},
			error: {}
		};
	}	

	_onSubmit = e => {

	}

	_onCancel = e => {

	}

	_onClickDelete = e => {

	}

	render() {
		const { doc, error } = this.state;
		const { orgId } = this.props;

		return (
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
					label="Job title" 
					placeholder="Job title"
					value={doc.jobTitle}
					onChangeText={jobTitle => this.setState({doc: {...doc, jobTitle}})}
					error={error.jobTitle}
				/>

				<HrDashed />
				<FormInput 
					label="Description" 
					placeholder="Description"
					value={doc.description}
					onChangeText={description => this.setState({doc: {...doc, description}})}
					error={error.description}
					multiline
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
							<a className="btn btn-white" onClick={this._onCancel}>Cancel</a>
							{' '}
							<button className="btn btn-primary" type="submit">Save changes</button>
						</div>
						<div className="col-md-2 col-md-offset-3">
							{orgId && (
								<a className="btn btn-danger" onClick={this._onClickDelete}>
									Delete Organization
								</a>
							)}
						</div>
					</div>
				</div>
			</form>
		);
	}
}

const mapMeteorToProps = params => {
	return {
		orgId: null,
	}	
}

export default createContainer(mapMeteorToProps, OrganizationForm);