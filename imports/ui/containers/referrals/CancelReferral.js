import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

// components
import NoticeForm from '/imports/ui/common/NoticeForm';
import Spinner from '/imports/ui/common/Spinner';

// collections
import {Referrals, STATUS} from '/imports/api/referrals/index';

// methods
import {setStatus as setReferralStatus} from '/imports/api/referrals/methods';

class CancelReferral extends Component {

  constructor() {
    super();

    this.state = {
      code: "404",
      message: "Page Not Found",
      description: "Sorry, but the page you are looking for has note been found. Try checking the URL for error, then hit the refresh button on your browser or try found something else in our app.",
      buttonLabel: "Come back to HomePage",
      redirectUrl: "/"
    };
  }

  componentWillReceiveProps(nextProps) {
    const
      {ready, referral} = nextProps
      ;
    console.log({ready, referral})
    if (ready && !_.isEmpty(referral)) {
      const
        {status} = referral
      ;
      if (status === STATUS.CONFIRMED) {
        FlowRouter.go('homePage');
      }
      else {
        setReferralStatus.call({params: {_id, status: STATUS.CANCELED}}, (error) => {
          if (!error) {
            const {message, description, buttonLabel, redirectUrl} = nextProps;
            this.setState({
              code,
              message: "",
              description: "We're sorry if you didn't like our vibe. Your request has been done.",
              buttonLabel: "You could know more about us here.",
              redirectUrl
            });
          } else {
            this.setState({
              code: '404',
              message: error.reason
            });
          }
        });
      }
    }
  }

  render() {
    const
      {ready} = this.props,
      {code, message, description, buttonLabel, redirectUrl} = this.state;
    if (ready) {
      return (
        <div>
          <NoticeForm
            code={code}
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
          <Spinner />
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
  let
    code = "404"
    ;

  return {
    ready: sub.ready(),
    referral
  };
}, CancelReferral);