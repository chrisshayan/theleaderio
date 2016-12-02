import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

// collections
import {Accounts} from 'meteor/accounts-base';
import {Profiles} from '/imports/api/profiles/index';

// components
import Spinner from '/imports/ui/common/Spinner';
import UsersTable from '/imports/ui/containers/admin/UsersTable';
import DatePicker from '/imports/ui/components/DatePicker';

class ManageUsers extends Component {
  render() {
    const {ready, users, profiles} = this.props;
    if (ready) {
      return (
        <div>
          <div className="row">
            <div className="search-form col-md-6" style={{marginTop: 20, paddingTop: 5}}>
              <form action="index.html" method="get">
                <div className="input-group">
                  <input type="text" placeholder="email, name, or alias, ..." name="search" className="form-control input-md"/>
                  <div className="input-group-btn">
                    <button className="btn btn-md btn-primary" type="submit">
                      Search
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-md-3">
              <DatePicker
                label="Created From:"
                option={{ startView: 2, todayBtn: "linked", keyboardNavigation: false, forceParse: false, autoclose: true }}
                isDateObject={true}
                value={new Date()}
                error={""}
                disabled={false}
                onChange={() => null}
              />
            </div>
            <div className="col-md-3">
              <DatePicker
                label="To:"
                option={{ startView: 2, todayBtn: "linked", keyboardNavigation: false, forceParse: false, autoclose: true }}
                isDateObject={true}
                value={new Date()}
                error={""}
                disabled={false}
                onChange={() => null}
              />
            </div>
          </div>
          <div className="hr-line-dashed"></div>
          <div className="row">
            <div className="search-result">
              <UsersTable
                users={users}
                profiles={profiles}
              />
            </div>
          </div>
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

  if (!_.isEmpty(users) && subProfiles.ready()) {
    let userIdList = [];
    users.map(user => {
      userIdList.push(user._id);
    });
    if (!_.isEmpty(userIdList)) {
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