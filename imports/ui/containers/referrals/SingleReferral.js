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

  _onResendReferral() {
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
        const
          closeButton = true,
          title = 'Referral',
          message = 'Invited';
        Notifications.success.call({closeButton, title, message});
      } else {
        const
          closeButton = true,
          title = 'Referral',
          message = `Invite failed: ${error.reason}`;
        Notifications.error.call({closeButton, title, message});
      }
    });
  }

  render() {
    const
      {position = '', referral, isDisableInviting} = this.props,
      {_id, firstName, lastName, email, status} = referral,
      disabled = (referral.status !== STATUS.CONFIRMED && referral.status !== STATUS.CANCELED) ? false : true,
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
            disabled={true}
          />
        </td>
        <td style={styles.vAlign}>
          <XEditable
            key={_id + '_last_name'}
            placeholder="Last name"
            valueName="value"
            value={lastName}
            disabled={true}
          />
        </td>
        <td style={styles.vAlign}>
          <XEditable
            key={_id + '_email'}
            placeholder="Email"
            valueName="value"
            value={email}
            disabled={true}
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
          {status === STATUS.CANCELED && (
            <span className="label label-default">{status.toLowerCase()}</span>
          )}
        </td>
        <td className="text-right" style={styles.vAlign}>
          {!(disabled) && (
            <button
              style={{marginBottom: 0}}
              className="btn btn-primary"
              onClick={this._onResendReferral.bind(this)}
            ><i className="fa fa-share"/>
              {' '}Resend
            </button>
          )}
        </td>
      </tr>
    );
  }
}