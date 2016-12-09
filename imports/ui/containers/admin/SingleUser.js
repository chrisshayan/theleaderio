import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import moment from 'moment';

// collections
import {Profiles} from '/imports/api/profiles/index';

// components
import XEditable from '/imports/ui/components/XEditable';
import LoadingIndicator from '/imports/ui/common/LoadingIndicator';

// methods
import * as Notifications from '/imports/api/notifications/methods';

// functions
import {disableAccount, enableAccount} from '/imports/api/users/methods';

// const
import {USER_ROLES} from '/imports/api/users/index';

export default class SingleUser extends Component {

  _onClick() {
    const
      adminUserId = Meteor.userId(),
      {user: {_id, email, username, createdAt, status, firstName, lastName, timezone}} = this.props,
      actionEnable = (status === USER_ROLES.INACTIVE) ? true : false,
      accountAction = actionEnable ? enableAccount : disableAccount,
      reason = actionEnable ? `enabled by admin ${adminUserId}` : `disabled by admin ${adminUserId}`,
      date = new Date()
      ;

    accountAction.call({email, null, reason, date}, (error, result) => {
      if(!error) {
        const closeButton = true,
          title = "",
          {message} = result
          ;
        Notifications.success.call({closeButton, title, message});
        console.log(result);
      } else {
        const closeButton = true,
          title = "",
          message = error.reason
          ;
        Notifications.error.call({closeButton, title, message});
      }
    });
  }

  render() {
    const
      {position = '', user} = this.props,
      {_id, email, username, createdAt, status, firstName, lastName, timezone} = user,
      actionEnable = (status === USER_ROLES.INACTIVE) ? true : false
      styles = {
        vAlign: {
          verticalAlign: 'middle'
        }
      }
      ;
    return (
      <tr>
        <td style={styles.vAlign}>
          <strong>{moment(createdAt).format("MMM Do, YYYY")}</strong>
        </td>
        <td style={styles.vAlign}>
          {firstName}
        </td>
        <td style={styles.vAlign}>
          {lastName}
        </td>
        <td style={styles.vAlign}>
          {email}
        </td>
        <td style={styles.vAlign}>
          {username}
        </td>
        <td style={styles.vAlign}>
          {timezone}
        </td>
        <td style={styles.vAlign}>
          <span className={actionEnable ? "label label-danger": "label label-primary"}>{status}</span>
        </td>
        <td style={styles.vAlign}>
          <button style={{marginBottom: 0}}
                  className={actionEnable ? "btn btn-primary" : "btn btn-danger"}
                  onClick={this._onClick.bind(this)}
          >
            {' '}{(actionEnable) ? "Enable" : "Disable"}
          </button>
        </td>
      </tr>
    );
  }
}