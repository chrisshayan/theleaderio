import React, { Component, PropTypes } from 'react';
import * as schedulerUtils from '/imports/utils/scheduler';
import Notifications from '/imports/api/notifications/functions';

class IntervalSelector extends Component {
  static propTypes = {
    scheduler: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
  }

  get canInterval2Weeks() {
    const { scheduler } = this.props;
    return schedulerUtils.validate(scheduler.quarter, 3, 'EVERY_2_WEEKS');
  }

  get canInterval1Month() {
    const { scheduler } = this.props;
    return schedulerUtils.validate(scheduler.quarter, 3, 'EVERY_MONTH');
  }

   /**
   * @event
   */
  _onChange = e => {
    e.preventDefault();

    const { scheduler } = this.props;
    const currentLength = scheduler.metrics ? scheduler.metrics.length : 0;
    const interval = e.target.value;
    const isValid = schedulerUtils.validate(scheduler.quarter, currentLength, interval);
    if(!isValid) {
      Notifications.error({message: 'Sending interval invalid'});
    } else {
      Meteor.call('scheduler.changeInterval', {
        schedulerId: scheduler._id,
        interval,
      }, error => {
        if(error) {
          Notifications.error({message: error.reason});
        } else {
          Notifications.success({message: 'Changed'});
        }
      })
    }
  }

  render() {
    const { disabled, scheduler } = this.props;
    return (
      <div>
        <select 
          className="form-control" 
          onChange={disabled ? null : this._onChange}
          disabled={disabled}
          value={scheduler.interval}
        >
          <option value="EVERY_WEEK">Every week</option>
          <option value="EVERY_2_WEEKS" disabled={!this.canInterval2Weeks}>Every 2 weeks</option>
          <option value="EVERY_MONTH" disabled={!this.canInterval1Month}>Every Month</option>
        </select>
        <p>Maximum 3 metrics</p>
      </div>
    );
  }
}

export default IntervalSelector;