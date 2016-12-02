import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';

// components
import SingleUser from '/imports/ui/containers/admin/SingleUser';
import NoUser from '/imports/ui/components/NoContent';

export default class UsersTable extends Component {

  _getProfile(userId) {
    // console.log(userId)
    const
      {profiles} = this.props,
      profile = profiles[_.findIndex(profiles, {userId})] || {}
      ;
    return profile;
  }

  render() {
    const
      {users, profiles} = this.props,
      message = `There is no new users.`
      ;

    if (!_.isEmpty(users)) {
      return (
        <table className="table">
          <thead>
          <tr>
            <th>First name</th>
            <th>Last name</th>
            <th>Email</th>
            <th>Alias</th>
            <th>Time zone</th>
            <th>Created at</th>
            <th>status</th>
          </tr>
          </thead>
          <tbody>
          {users.map((user, key) => (
            <SingleUser
              _id={user._id}
              userId={user._id}
              key={key}
              position={key + 1}
              user={user}
              profile={this._getProfile.bind(this, user._id)()}
            />
          ))}
          </tbody>
        </table>
      );
    } else {
      return (
        <NoUser
          icon="fa fa-users"
          message={message}
        />
      );
    }
  }
}