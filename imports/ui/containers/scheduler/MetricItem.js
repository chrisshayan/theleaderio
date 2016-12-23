import React, { Component, PropTypes } from 'react';
import { 
  Scheduler as SchedulerCollection, 
  METRICS_UI_INFO,
} from '/imports/api/scheduler';

import * as Notifications from '/imports/api/notifications/functions';

class MetricItem extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    schedulerId: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
  }

  get metric() {
    const key = this.props.name;
    return _.find(METRICS_UI_INFO, r => r.key === key) || {};
  }

  get name() {
    return this.metric.name || '';
  }

  get shortName() {
    return this.metric.shortName || '';
  }

  get icon() {
    if(!this.metric.icon) return '';
    return this.metric.icon + ' flaticon-2x ';
  }

  /**
   * EVENTS
   */
  _removeMetric = e => {
    e.preventDefault();
    const { name, schedulerId } = this.props;
    Meteor.call('scheduler.removeMetricOfQuarter', { schedulerId, metric: name }, error => {
      if(error) {
        Notifications.error({message: error.reason});
      } else {
        Notifications.success({message: 'Removed'});
      }
    });
  }

  render() {
    const { disabled } = this.props;
    return (
      <li className="scheduler-metric-item">
        <div className="row vertical-align" style={{position: 'relative'}}>
          <div className="col-xs-3">
            <i className={this.icon} />
          </div>
          <div className="col-xs-9 text-left">
            <h4 className="font-bold" style={{margin: 0, lineHeight: '37px'}}>{ this.shortName }</h4>
          </div>

          {/* Render remove button if item is enable*/}
          {!disabled && (
            <button
              className="btn btn-link btn-remove-metric"
              onClick={this._removeMetric}
            >
              <i className="fa fa-trash" />
            </button>
          )}
        </div>
      </li>
    );
  }
}

export default MetricItem;