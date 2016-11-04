import React, {Component} from 'react';

// components
import XEditable from '/imports/ui/components/XEditable';

// constants
import {STATUS} from '/imports/api/referrals/index';

// methods
import {send as sendReferral, remove as removeReferral} from '/imports/api/referrals/methods';
import * as Notifications from '/imports/api/notifications/methods';
import {getErrors} from '/imports/utils';

export default class SingleReferral extends Component {

  _onSendReferral() {
    const {_id} = this.props;
    if(typeof _id === 'undefined') {
      const
        closeButton = true,
        title = 'Referral',
        message = 'Referral not exists';
      Notifications.error.call({closeButton, title, message});
      return;
    }
    sendReferral.call({params: {referralId: _id}}, (error, result) => {
      if(!error) {
        console.log(result);
      } else {
        console.log(error)
      }
    });
  }

  _onRemoveReferral() {
    const {_id} = this.props;
    if(typeof _id === 'undefined') {
      const
        closeButton = true,
        title = 'Referral',
        message = 'Referral not exists';
      Notifications.error.call({closeButton, title, message});
      return;
    }
    removeReferral.call({params: {_id}}, (error, result) => {
      if(!error) {
        const
          closeButton = true,
          title = 'Referral',
          message = 'Removed';
        Notifications.success.call({closeButton, title, message});
      } else {
        const
          closeButton = true,
          title = 'Referral',
          message = getErrors(error);
        Notifications.error.call({closeButton, title, message});
      }
    });
  }

  render() {
    const
      {position = '', referral, isDisableInviting} = this.props,
      {_id, firstName, lastName, email, status} = referral,
      disabled = (referral.status !== STATUS.WAITING) ? true : false,
      styles = {
        vAlign: {
          verticalAlign: 'middle'
        }
      }
      ;
    return (
      <tr>
        <td style={styles.vAlign}>{ position }</td>
        <td style={styles.vAlign}>
          <XEditable
            key={_id + '_first_name'}
            placeholder="First name"
            valueName="value"
            value={firstName}
            method="referrals.updateSingleField"
            selector={{_id, field: 'firstName'}}
            disabled={disabled}
          />
        </td>
        <td style={styles.vAlign}>
          <XEditable
            key={_id + '_last_name'}
            placeholder="Last name"
            valueName="value"
            value={lastName}
            method="referrals.updateSingleField"
            selector={{_id, field: 'lastName'}}
            disabled={disabled}
          />
        </td>
        <td style={styles.vAlign}>
          <XEditable
            key={_id + '_email'}
            placeholder="Email"
            valueName="value"
            value={email}
            method="referrals.updateSingleField"
            selector={{_id, field: 'lastName'}}
            disabled={disabled}
          />
        </td>
        <td className="client-status" style={styles.vAlign}>
          {status === STATUS.WAITING && (
            <span className="label label-default">{status.toLowerCase()}</span>
          )}
          {status === STATUS.INVITED && (
            <span className="label label-warning">{status.toLowerCase()}</span>
          )}
          {status === STATUS.CONFIRMED && (
            <span className="label label-primary">{status.toLowerCase()}</span>
          )}
        </td>
        <td className="text-right" style={styles.vAlign}>
          {!(isDisableInviting || disabled) && (
            <button
              style={{marginBottom: 0}}
              className="btn btn-primary"
              onClick={this._onSendReferral.bind(this)}
            ><i className="fa fa-share"/>
              {' '}Send
            </button>
          )}
          {" "}
          {!disabled && (
            <button
              style={{marginBottom: 0}}
              className="btn btn-danger"
              onClick={this._onRemoveReferral.bind(this)}
            ><i className="fa fa-trash"/>
              {' '}Remove
            </button>
          )}
        </td>
      </tr>
    );
  }
}