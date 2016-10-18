import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {
  Scheduler as SchedulerCollection,
  METRICS_UI_INFO,
} from '/imports/api/scheduler';

// methods
import {getLeaderPlans} from '/imports/api/sending_plans/methods';
import * as schedulerUtils from '/imports/utils/scheduler';
import {removeMetricOfQuarter} from '/imports/api/scheduler/methods';

import IntervalSelector from './_IntervalSelector';
import MetricItem from './MetricItem';

class SchedulerQuarter extends Component {

  static state = {
    havePlans: false
  };

  static propTypes = {
    name: PropTypes.string.isRequired,
    scheduler: PropTypes.object.isRequired,
    onClickAddMetric: PropTypes.func.isRequired
  }

  get isActive() {
    const {scheduler} = this.props;
    return schedulerUtils.isQuarterActive(scheduler.quarter);
  }


  componentWillMount() {
    const
      date = new Date(),
      isActive = this.isActive,
      scheduler = this.props;
    ;
    getLeaderPlans.call({}, (error, planList) => {
      if (!error) {
        if (_.isEmpty(planList)) {
          if (isActive) {
            if (!_.isEmpty(scheduler)) {
              const
                {metrics, _id} = scheduler.scheduler,
                metric = metrics.pop(metrics[0])
                ;
              if(typeof metric !== 'undefined') {
                removeMetricOfQuarter.call({
                  schedulerId: _id,
                  metric
                }, (error, result) => {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log(result);
                  }
                });
              }
            }
          }
        }
      }
    });

  }

  render() {
    const
      {name, scheduler, onClickAddMetric} = this.props,
      isActive = this.isActive
      ;
    return (
      <div className="col-sm-6 col-md-3 col-lg-3">
        <div className="ibox">
          <div className="ibox-content">
            <h3>{ name }</h3>
            <IntervalSelector scheduler={scheduler} disabled={!isActive}/>
            <div>
              <button
                className="btn btn-sm btn-white btn-block"
                onClick={() => isActive ? onClickAddMetric(scheduler) : null}
                disabled={!isActive || scheduler.metrics.length >= 3 }
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
                  disabled={!isActive}
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
