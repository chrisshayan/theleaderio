import React, {Component} from 'react';

// components
import Calendar from '/imports/ui/containers/calendar/Calendar';

export class FinalStep extends Component {
  render() {
    return (
      <div style={{paddingLeft: 0}}>
        <div className="alert alert-info">
          The first survey <strong>"Respect"</strong> will be sent on December 28, 2016 to all of your active employees.
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
  }
}