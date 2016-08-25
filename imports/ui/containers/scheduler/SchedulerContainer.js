import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { setPageHeading, resetPageHeading } from '/imports/store/modules/pageHeading';
import { SkyLightStateless } from 'react-skylight';
import { INTERVAL, Scheduler as SchedulerCollection } from '/imports/api/scheduler';
import LoadingIndicator from '/imports/ui/common/LoadingIndicator';
import * as schedulerUtils from '/imports/utils/scheduler';

import SchedulerQuarter from './SchedulerQuarter';
import SchedulerMetricDialog from './SchedulerMetricDialog';

class Scheduler extends Component {

  state = {
    metricDialog: undefined,
  }

  _onClickAddMetric = metric => {
    this.setState({ metricDialog: metric });
  }

  _onDismissAddMetric = e => {
    e && e.preventDefault();
    this.setState({ metricDialog: undefined });
  }

  getQuarter = (quarter) => {
    const quarters = this.props.quarters || [];
    return _.find(quarters, r => r.quarter === quarter);
  }

  render() {
    const { isLoading, quarters } = this.props;
    return (
      <div>
        <div className="row">
          {isLoading && (<LoadingIndicator />)}
        </div>
        
        {quarters.length == 4 && (
          <div className="row">
            <SchedulerQuarter name="1st Quarter" scheduler={this.getQuarter('QUARTER_1')} onClickAddMetric={this._onClickAddMetric} />
            <SchedulerQuarter name="2th Quarter" scheduler={this.getQuarter('QUARTER_2')} onClickAddMetric={this._onClickAddMetric}/>
            <SchedulerQuarter name="3th Quarter" scheduler={this.getQuarter('QUARTER_3')} onClickAddMetric={this._onClickAddMetric}/>
            <SchedulerQuarter name="4th Quarter" scheduler={this.getQuarter('QUARTER_4')} onClickAddMetric={this._onClickAddMetric}/>
          </div>
        )}
  
        <SchedulerMetricDialog
          show={!!this.state.metricDialog}
          metric={this.state.metricDialog}
          onDismiss={this._onDismissAddMetric}
        />
      </div>
    );
  }
}

const mapMeteorToProps = () => {
  const year = moment().year();
  const sub = Meteor.subscribe('Scheduler.list', year);
  return {
    isLoading: !sub.ready(),
    quarters: SchedulerCollection.find({ year }).fetch()
  };
}

export default createContainer(mapMeteorToProps, Scheduler);
