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
            value={userEmail.address}
            disabled={true}
          />
        </td>
        <td style={styles.vAlign}>
          <XEditable
            key={_id + '_alias'}
            placeholder="Alias"
            valueName="value"
            value={username}
            disabled={true}
          />
        </td>
        <td style={styles.vAlign}>
          <XEditable
            key={_id + '_timezone'}
            placeholder="Timezone"
            valueName="value"
            value={timezone}
            disabled={true}
          />
        </td>
        <td style={styles.vAlign}>
          <XEditable
            key={_id + '_createdAt'}
            placeholder="Created at"
            valueName="value"
            value={moment(createdAt).format("MMM Do, YYYY")}
            disabled={true}
          />
        </td>
      </tr>
    );
  }
}