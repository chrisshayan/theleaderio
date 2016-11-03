import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';

// components
import SingleReferral from '/imports/ui/containers/referrals/SingleReferral';
import NoReferral from '/imports/ui/components/NoContent';

export default class ReferralsTable extends Component {
  render() {
    const
      {isDisableInviting, referrals} = this.props,
      message = `There is no ${name} referral.`
      ;

    if (!_.isEmpty(referrals)) {
      return (
        <table className="table">
          <thead>
          <tr>
            <th>#</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
          </thead>
          <tbody>
          {referrals.map((referral, key) => (
            <SingleReferral
              key={key}
              position={key + 1}
              referral={referral}
              isDisableInviting={isDisableInviting}
            />
          ))}
          </tbody>
        </table>
      );
    } else {
      return (
        <NoReferral
          icon="fa fa-users"
          message={message}
        />
      );
    }
  }
}