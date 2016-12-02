import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

// collections
import {Profiles} from '/imports/api/profiles/index';

// components
import XEditable from '/imports/ui/components/XEditable';
import LoadingIndicator from '/imports/ui/common/LoadingIndicator';

export default class SingleUser extends Component {
  render() {
    const
      {position = '', user, profile} = this.props,
      {_id, emails, username, createdAt} = user,
      [userEmail] = emails,
      {firstName, lastName, timezone} = profile,
      styles = {
        vAlign: {
          verticalAlign: 'middle'
        }
      }
      ;
    return (
      <tr>
        <td style={styles.vAlign}>
          {firstName}
        </td>
        <td style={styles.vAlign}>
          {lastName}
        </td>
        <td style={styles.vAlign}>
          {userEmail.address}
        </td>
        <td style={styles.vAlign}>
          {username}
        </td>
        <td style={styles.vAlign}>
          {timezone}
        </td>
        <td style={styles.vAlign}>
          {moment(createdAt).format("MMM Do, YYYY")}
        </td>
        <td style={styles.vAlign}>
          <span className="label label-warning">disabled</span>
        </td>
        <td className="text-right" style={styles.vAlign}>
          <button style={{marginBottom: 0}} className="btn btn-primary">
            {' '}Enable
          </button>
        </td>
      </tr>
    );
  }
}