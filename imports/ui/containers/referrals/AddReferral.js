import React, {Component} from 'react';
import {SkyLightStateless} from 'react-skylight';
import FormInput from '/imports/ui/components/FormInput';
import {getErrors} from '/imports/utils';

// methods
import {create as createReferral} from '/imports/api/referrals/methods';
import * as Notifications from '/imports/api/notifications/methods';

// constants
import {STATUS} from '/imports/api/referrals/index';

const initialState = {
  doc: {
    firstName: '',
    lastName: '',
    email: '',
  },
  error: {}
};

export default class AddReferral extends Component {
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
    const
      {doc} = this.state
      ;

    // console.log(doc)
    createReferral.call({params: doc}, (error, referralId) => {
      if (!error) {
        const
          closeButton = false,
          title = 'Referral',
          message = 'Added';
        Notifications.success.call({closeButton, title, message});
        // window.trackEvent('add_referral', {
        //   referralId,
        //   name: [data['firstName'], data['lastName']].join(' '),
        //   email: data['email']
        // });
        this._onCancel();
      } else {
        this.setState({error: getErrors(error)});
      }
    });
  }

  render() {
    const {show, onDismiss} = this.props;
    const {doc, error} = this.state;
    return (
      <SkyLightStateless
        isVisible={show}
        onCloseClicked={onDismiss}
        title={'Add new referral' }
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
