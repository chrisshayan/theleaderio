import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

import Spinner from '/imports/ui/common/Spinner';
import NoticeForm from '/imports/ui/common/NoticeForm';

// collections
import {Referrals} from '/imports/api/referrals/index';

// methods
import {setStatus} from '/imports/api/referrals/methods';

// constants
import {STATUS} from '/imports/api/referrals/index';

class CancelReferral extends Component {

  constructor() {
    super();

    this.state = {
      message: null,
      description: null,
      buttonLabel: null,
      redirectUrl: null
    };
  }

  // componentWillMount() {
  //   const _id = FlowRouter.getQueryParam('_id');
  //   if (typeof _id !== 'undefined') {
  //     setStatus.call({params: {_id, status: STATUS.CANCELED}}, (error) => {
  //       if(!!error) {
  //         this.setState({
  //           message: "Can't cancel",
  //           description: error.reason,
  //           buttonLabel: 'Contact us',
  //           redirectUrl: '/'
  //         });
  //       }
  //     });
  //   }
  // }

  componentWillReceiveProps(nextProps) {
    const {ready, referral} = nextProps;
    if(ready) {
      const {status} = referral;
      if(status === STATUS.CONFIRMED) {
        this.setState({
          message: "Can't cancel",
          description: 'This invitation had been confirmed.',
          buttonLabel: 'Login to your account',
          redirectUrl: FlowRouter.path('SignInPage', {action: 'alias'})
        });
      } else {
        const _id = FlowRouter.getQueryParam('_id');
        this.setState({
          message: 'Canceled',
          description: 'We are sad when you left. We could improve leadership together.',
          buttonLabel: 'Know more about us',
          redirectUrl: '/'
        });
        setStatus.call({params: {_id, status: STATUS.CANCELED}});
      }
    }
  }

  render() {
    const
      {message, description, buttonLabel, redirectUrl} = this.state,
      {ready, referral} = this.props
      ;

    if(ready) {
      return (
        <div>
          <NoticeForm
            code='TL+'
            message={message}
            description={description}
            buttonLabel={buttonLabel}
            redirectUrl={redirectUrl}
          />
        </div>
      );
    } else {
      return (
        <div>
          <Spinner/>
        </div>
      );
    }
  }
}

export default CancelReferralContainer = createContainer((params) => {
  const
    {_id} = params,
    sub = Meteor.subscribe('referrals.cancellation', {_id}),
    referral = Referrals.findOne({_id})
    ;

  return {
    ready: sub.ready(),
    referral
  };
}, CancelReferral);