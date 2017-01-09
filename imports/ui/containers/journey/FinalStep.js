import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

// collections
import {SendingPlans} from '/imports/api/sending_plans/index';

// components
import Calendar from '/imports/ui/containers/calendar/Calendar';
import Spinner from '/imports/ui/common/Spinner';

class FinalStep extends Component {
  render() {
    const {ready, plans: [plan]} = this.props
      ;
    let metric = "", sendDate = new Date();

    if(!_.isEmpty(plan)) {
      metric = plan.metric.toLowerCase();
      sendDate = plan.sendDate;
    }

    if(ready) {
      return (
        <div style={{paddingLeft: 0}}>
          <div className="alert alert-info">
            The first survey <strong style={{textTransform: 'capitalize'}}>{metric}</strong> will be sent on {moment(sendDate).format('MMM Do, YYYY')} to all of your active employees.
          </div>
          <h5>Here is the schedule for your survey plan:</h5>
          <div className="ibox-content">
            <Calendar/>
          </div>
          <button className="btn btn-primary pull-right"
                  onClick={() => FlowRouter.go('app.dashboard')}
                  style={{marginRight: 19}}
                  disabled={false}
          >View your dashboard{" "}<i className="fa fa-arrow-right"></i>
          </button>
        </div>
      );
    } else {
      return (
        <Spinner />
      );
    }
  }
}

export default FinalStepContainer = new createContainer(() => {
  const
    sub = Meteor.subscribe('sendingPlans'),
    leaderId = Meteor.userId()
  ;

  return {
    ready: sub.ready(),
    plans: SendingPlans.find({leaderId, status: "READY", sendDate: {$gte: new Date()}},
      {sort: {sendDate: 1}, limit: 1}).fetch()
  }
}, FinalStep);