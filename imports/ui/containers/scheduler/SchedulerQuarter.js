import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { 
  Scheduler as SchedulerCollection, 
  MEETINGS_UI_INFO,
} from '/imports/api/scheduler';
import * as schedulerUtils from '/imports/utils/scheduler';

import IntervalSelector from './_IntervalSelector';
import MetricItem from './MetricItem';

class SchedulerQuarter extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    scheduler: PropTypes.object.isRequired,
    onClickAddMetric: PropTypes.func.isRequired
  }

  get isActive() {
    const { scheduler } = this.props;
    return schedulerUtils.isQuarterActive(scheduler.quarter);
  }

  render() {
    const { name, scheduler, disabled, onClickAddMetric } = this.props;
    return (
      <div className="col-lg-3">
        <div className="ibox">
          <div className="ibox-content">
            <h3>{ name }</h3>
            <IntervalSelector scheduler={scheduler} disabled={!this.isActive}/>
            <div>
              <button 
                className="btn btn-sm btn-white btn-block"
                onClick={() => this.isActive ? onClickAddMetric(scheduler) : null}
                disabled={!this.isActive || scheduler.metrics.length >= 3 }
              >
                <i className="fa fa-plus"></i>
                {' '}
                Add metric
              </button>
            </div>
            <ul className="sortable-list connectList agile-list ui-sortable" id="todo">
              {scheduler && scheduler.metrics && scheduler.metrics.map((metricKey, key) => (
                <MetricItem 
                  key={key} 
                  name={metricKey} 
                  schedulerId={scheduler._id}
                  disabled={!this.isActive}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default SchedulerQuarter;
