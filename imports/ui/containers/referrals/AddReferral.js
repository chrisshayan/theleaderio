import React, {Component} from 'react';
import {SkyLightStateless} from 'react-skylight';
import FormInput from '/imports/ui/components/FormInput';
import {getErrors} from '/imports/utils';

// methods
import {create as createReferral} from '/imports/api/referrals/methods';
import {send as sendReferral} from '/imports/api/referrals/methods';
import * as Notifications from '/imports/api/notifications/functions';
import {verify as verifyEmail} from '/imports/api/users/methods';
import {verify as verifyReferral} from '/imports/api/referrals/methods';

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
      {doc} = this.state,
      {email} = doc
      ;

    // console.log(doc)

    // verify email address before create referral
    // from referral
    verifyReferral.call({params: {email}}, (error, noOfReferral) => {
      if(!error) {
        if(noOfReferral === 0) {
          // verify from users
          verifyEmail.call({email}, (error) => {
            if (error) {
              // create referral
              createReferral.call({params: doc}, (error, referralId) => {
                if (!error) {
                  sendReferral.call({params: {referralId}}, (error, result) => {
                    if(!error) {
                      const
                        closeButton = true,
                        title = 'Referral',
                        message = 'Invited';
                      Notifications.success({closeButton, title, message});
                    } else {
                      const
                        closeButton = true,
                        title = 'Referral',
                        message = `Invite failed: ${error.reason}`;
                      Notifications.error({closeButton, title, message});
                    }
                  });
                  this._onCancel();
                } else {
                  const
                    closeButton = true,
                    title = 'Referral',
                    message = error.reason;
                  Notifications.error({closeButton, title, message});
                }
              });
            } else {
              this.setState({error: `${email} is a leader already!`});
            }
          });
        } else {
          this.setState({error: `${email} was in referrals list!`});
        }
      } else {
        const
          closeButton = true,
          title = 'Referral',
          message = error.reason;
        Notifications.error({closeButton, title, message});
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
            required={true}
          />
          <FormInput
            label="Last name"
            placeholder="Last name"
            value={doc.lastName}
            onChangeText={lastName => this.setState({doc: { ...doc, lastName }})}
          />
          <FormInput
            type="email"
            label="Email"
            placeholder="Email"
            value={doc.email}
            onChangeText={email => this.setState({doc: { ...doc, email }})}
            required={true}
          />
          {!_.isEmpty(error) && (
            <p className="alert-danger text-center">{error}</p>
          )}
          <div className="form-group">
            <a href="#" className="btn btn-default" onClick={this._onCancel}>Cancel</a>
            {' '}
            <button className="btn btn-primary" onClick={this._onSave}>Send</button>
          </div>
        </form>
      </SkyLightStateless>
    );
  }
}
