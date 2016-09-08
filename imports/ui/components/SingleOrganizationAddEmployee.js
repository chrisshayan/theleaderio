import React, { Component } from 'react';
import { SkyLightStateless } from 'react-skylight';
import FormInput from '/imports/ui/components/FormInput';
import * as orgActions from '/imports/api/organizations/methods';
import { getErrors } from '/imports/utils';
import * as Notifications from '/imports/api/notifications/methods';

const initialState = {
	doc: {
		firstName: '',
		lastName: '',
		email: ''
	},
	error: {}
};

class SingleOrganizationAddEmployee extends Component {
	state = initialState

	reset = () => {
		this.setState(initialState);
	}

	_onCancel = e => {
		e && e.preventDefault();
    this.reset();
		this.props.onDismiss && this.props.onDismiss();
	}

	_onSave = e => {
		e.preventDefault();
		const data = {
			...this.state.doc,
			organizationId: this.props.organizationId
		};
		orgActions.addEmployee.call(data, (err) => {
			if (err) {
				const error = getErrors(err);
				this.setState({ error });
			} else {
        const
          closeButton = false,
          title = 'Employee',
          message = 'Added';
        Notifications.success.call({ closeButton, title, message });
				this._onCancel();
			}
		})
	}

	render() {
		const { show, onDismiss, employeeId } = this.props;
		const { doc, error } = this.state;
		return (
			<SkyLightStateless
          isVisible={show}
          onCloseClicked={onDismiss}
          title={ employeeId ? 'Update employee' : 'Add new employee' }
          dialogStyles={{zIndex: 9999}}
          beforeOpen={this.reset}
        >
        <form onSubmit={this._onSave}>
        	<FormInput 
        		label="First name" 
        		placeholder="First name"
        		value={doc.firstName}
        		onChangeText={firstName => this.setState({doc: { ...doc, firstName }})}
        		error={error.firstName}
      		/>
        	<FormInput 
        		label="Last name" 
        		placeholder="Last name" 
        		value={doc.lastName}
        		onChangeText={lastName => this.setState({doc: { ...doc, lastName }})}
        		error={error.lastName}
      		/>
        	<FormInput 
        		label="Email" 
        		placeholder="Email"
        		value={doc.email}
        		onChangeText={email => this.setState({doc: { ...doc, email }})}
        		error={error.email}
      		/>
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

export default SingleOrganizationAddEmployee;
