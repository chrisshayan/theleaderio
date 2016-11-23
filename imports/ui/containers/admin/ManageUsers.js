import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

// collections
import {Accounts} from 'meteor/accounts-base';
import {Profiles} from '/imports/api/profiles/index';

// components
import Spinner from '/imports/ui/common/Spinner';
import UsersTable from '/imports/ui/containers/admin/UsersTable';

class ManageUsers extends Component {
  render() {
    const {ready, users, profiles} = this.props;
    if (ready) {
      return (
        <div className="row">
          <UsersTable
            users={users}
            profiles={profiles}
          />
        </div>
      );
    } else {
      return (
        <Spinner/>
      );
    }
  }
}

export default ManageUsersContainer = createContainer((params) => {
  const
    subUsers = Meteor.subscribe('statistic.users'),
    subProfiles = Meteor.subscribe('statistic.profiles'),
    query = {username: {$exists: true}},
    options = {sort: {createdAt: -1}, limit: 50},
    users = Accounts.users.find(query, options).fetch()
  ;
  let
    profiles = [],
    profilesReady = false
    ;

  if(!_.isEmpty(users) && subProfiles.ready()) {
    let userIdList = [];
    users.map(user => {
      userIdList.push(user._id);
    });
    if(!_.isEmpty(userIdList)) {
      profiles = Profiles.find({userId: {$in: userIdList}}).fetch();
      profilesReady = true;
    }
  }

  return {
    ready: subUsers.ready(), //& profilesReady,
    users,
    profiles
  };
}, ManageUsers);