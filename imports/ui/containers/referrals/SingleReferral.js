import React, {Component} from 'react';

// components
import XEditable from '/imports/ui/components/XEditable';

// constants
import {STATUS} from '/imports/api/referrals/index';

export default class SingleReferral extends Component {
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
          <button
            style={{marginBottom: 0}}
            className="btn btn-primary"
            disabled={isDisableInviting || disabled}
          ><i className="fa fa-share"/>
            {' '}Invite
          </button>
          {" "}
          <button
            style={{marginBottom: 0}}
            className="btn btn-danger"
            disabled={disabled}
          ><i className="fa fa-trash"/>
            {' '}Remove
          </button>
        </td>
      </tr>
    );
  }
}