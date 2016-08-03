import React, { Component, PropTypes } from 'react';

import moment from 'moment';

import HrDashed from '/imports/ui/components/HrDashed';
import FormInput from '/imports/ui/components/FormInput';
import DatePicker from '/imports/ui/components/DatePicker';
import CheckBox from '/imports/ui/components/CheckBox';

class OrganizationInformationForm extends Component {

	static propTypes = {
		_id: PropTypes.string,
		doc: PropTypes.object,
		error: PropTypes.object,
		onSubmit: PropTypes.func,
		onDelete: PropTypes.func,
		onCancel: PropTypes.func,
	};

	static defaultProps = {
		_id: null,
		doc: {},
		error: {},
		onChange: () => null,
		onSubmit: () => null,
		onDelete: () => null,
		onCancel: () => null,
	};

	state = {
		doc: {}
	};

	componentDidMount() {
		this._initFormData(this.props.doc);
	}

	componentWillReceiveProps(nextProps) {
		this._initFormData(nextProps.doc);
	}

	/**
	 * set form data
	 * @param  {object} doc
	 * @return {void}
	 */
	_initFormData(doc) {
		this.setState({ doc });
	}

	/**
	 * @event
	 * on form field change
	 * @param  {string} field
	 * @param  {string} value
	 */
	_onFieldChange = (field, value) => {
		doc = {
			...this.state.doc,
			[field]: value
		};
		this.setState({ doc });
		this.props.onChange(doc);
	}

	_onSubmit = e => {
		e.preventDefault();
		this.props.onSubmit(this.state.doc);
	}

	render() {
		const { _id, doc, error, isLoading, onSubmit, onDelete, onCancel } = this.props;
		return (
			<form onSubmit={this._onSubmit}>
				<FormInput 
					label="Name" 
					placeholder="name"
					value={doc.name}
					error={error.name}
					disabled={isLoading}
					onChangeText={val => this._onFieldChange('name', val)}
				/>
				<HrDashed />
				<FormInput
					label="Title" 
					placeholder="Job title" 
					value={doc.jobTitle} 
					error={error.jobTitle}
					disabled={isLoading}
					onChangeText={val => this._onFieldChange('jobTitle', val)}
				/>
				<HrDashed />
				<FormInput 
					label="Description" 
					placeholder="Description"
					multiline={true}
					value={doc.description} 
					error={error.description}
					disabled={isLoading}
					onChangeText={val => this._onFieldChange('description', val)}
				/>
				<HrDashed />
				<div className="row">
					<div className="col-md-4">
						<DatePicker 
							label="Start time" 
							option={{ startView: 2, todayBtn: "linked", keyboardNavigation: false, forceParse: false, autoclose: true }} 
							isDateObject={true} 
							value={doc.startTime}
							error={error.startTime}
							disabled={isLoading}
							onChange={val => this._onFieldChange('startTime', val)}
						/>
					</div>
					<div className="col-md-4">
						<DatePicker 
							label="End time" 
							option={{ startView: 2, todayBtn: "linked", keyboardNavigation: false, forceParse: false, autoclose: true }} 
							isDateObject={true} 
							value={doc.endTime} 
							error={error.endTime} 
							disabled={doc.isPresent || isLoading}
							onChange={val => this._onFieldChange('endTime', val)}
						/>
					</div>
					<div className="col-md-4">
						<CheckBox 
							label="Current organization" 
							checked={doc.isPresent} 
							disabled={isLoading}
							onChange={val => this._onFieldChange('isPresent', val)}
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
							<a className="btn btn-white" onClick={onCancel}>Cancel</a> {' '}
							{isLoading ? (
								<button className="btn btn-primary" disabled={true}>Saving...</button>
							) : (
								<button className="btn btn-primary" type="submit">Save changes</button>
							)}
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
		);
	}
}

export default OrganizationInformationForm;