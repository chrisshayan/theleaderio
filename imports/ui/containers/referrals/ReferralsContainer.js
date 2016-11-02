import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {setPageHeading, resetPageHeading} from '/imports/store/modules/pageHeading';

// collections
import {Referrals} from '/imports/api/referrals/index';

export default class ReferralsContainer extends Component {
  componentWillMount() {
    setPageHeading({
      title: 'Referrals',
      breadcrumb: [{
        label: 'Referrals',
        route: FlowRouter.url('app.referrals')
      }]
    });
  }

  componentWillUnmount() {
    resetPageHeading();
  }

  render() {
    return (
      <div>
        Referrals Container
      </div>
    );
  }
}