import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {setPageHeading, resetPageHeading} from '/imports/store/modules/pageHeading';

// collections
import {Referrals, STATUS} from '/imports/api/referrals/index';

// components
import Box from '/imports/ui/components/Box';
import Indicator from '/imports/ui/common/LoadingIndicator';
import ReferralsTable from '/imports/ui/containers/referrals/ReferralsTable';
import AddReferral from '/imports/ui/containers/referrals/AddReferral';

// methods
import {verifyAdminRole} from '/imports/api/users/methods';

class ReferralsComponent extends Component {
  constructor() {
    super();

    this.state = {
      showAddDialog: false,
      isAdmin: false
    };
  }

  componentWillMount() {
    setPageHeading({
      title: 'Referrals',
      breadcrumb: [{
        label: 'Referrals',
        route: FlowRouter.url('app.referrals'),
        active: true
      }]
    });

    this.setState({
      isAdmin: false
    });
    if (!!Meteor.userId()) {
      verifyAdminRole.call({userId: Meteor.userId()}, (error, result) => {
        if (!error) {
          this.setState({
            isAdmin: result.isAdmin
          });
        }
      });
    }

  }

  componentWillUnmount() {
    resetPageHeading();
  }

  _onClickShowDialog = e => {
    this.setState({showAddDialog: true});
  }

  _onDismissDialog = e => {
    this.setState({ showAddDialog: false });
  }

  render() {
    const
      {
        ready = false,
        maxAllowInvitation,
        waitingReferrals,
        invitedReferrals,
        confirmedReferrals,
        isAllowAdding,
        referrals = []
      } = this.props,
      {
        isAdmin,
        showAddDialog
      } = this.state,
      statistic = `Waiting ${waitingReferrals} - Invited: ${invitedReferrals} - Confirmed: ${confirmedReferrals}`
      ;
    let isDisableInviting = false;

    if (ready) {
      isDisableInviting = !(isAdmin || isAllowAdding);
      return (
        <div>
          {!_.isEmpty(referrals) ? (
            <Box>
              <div className="row">
                <div className="col-md-6 text-left">
                  <h4>{statistic}</h4>
                </div>
                <div className="col-md-6 text-right">
                  <a className="btn btn-primary"
                     onClick={this._onClickShowDialog}
                  >
                    <i className="fa fa-plus"/>
                    {' '}
                    Add referral
                  </a>
                </div>
              </div>
              <div className="row">
                <ReferralsTable
                  isDisableInviting={isDisableInviting}
                  referrals={referrals}
                />
              </div>
            </Box>
          ) : (
            <NoReferral
              icon="fa fa-users"
              message="There is no referral."
            />
          )}
          <AddReferral
            show={showAddDialog}
            onDismiss={this._onDismissDialog}
          />
        </div>
      );
    } else {
      return (
        <Indicator/>
      );
    }
  }
}

export default ReferralsContainer = createContainer((params) => {
  const
    leaderId = Meteor.userId(),
    sub = Meteor.subscribe("referrals"),
    maxAllowInvitation = Meteor.settings.public.maxInvitation, // this value should get from settings file
    currentNotWaitingReferrals = Referrals.find({status: {$not: /WAITING/}}).count(),
    ready = sub.ready(),
    referrals = Referrals.find({leaderId}).fetch()
    ;
  let
    waitingReferrals = 0,
    invitedReferrals = 0,
    confirmedReferrals = 0
  ;

  if(!_.isEmpty(referrals)) {
    referrals.map(referral => {
      switch (referral.status) {
        case STATUS.WAITING: {
          waitingReferrals += 1;
          break;
        }
        case STATUS.INVITED: {
          invitedReferrals += 1;
          break;
        }
        case STATUS.CONFIRMED: {
          confirmedReferrals += 1;
          break;
        }
      }
    });
  }

  return {
    ready,
    isAllowAdding: (currentNotWaitingReferrals < maxAllowInvitation) ? true : false,
    maxAllowInvitation,
    waitingReferrals,
    invitedReferrals,
    confirmedReferrals,
    referrals
  };
}, ReferralsComponent);