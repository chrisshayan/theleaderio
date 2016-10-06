import React, { Component } from 'react';
import { SkyLightStateless } from 'react-skylight';
import { METRICS_UI_INFO } from '/imports/api/scheduler';

import * as Notifications from '/imports/api/notifications/methods';


class SchedulerMetricDialog extends Component {

  static defaultProps = {
    metric: {}
  }

  _onAddMetric = selected => {
    const { metric, onDismiss } = this.props;
    Meteor.call('scheduler.addMetricToQuarter', {
      schedulerId: metric._id,
      metric: selected.key
    }, error => {
      if (error) {
        Notifications.error.call({ message: error.reason });
      } else {
        onDismiss();
        Notifications.success.call({ message: 'Added' });
        window.trackEvent('update_scheduler');
      }
    });
  }

  isMetricDisabled = m => {
    const { metric } = this.props;
    const selected = metric.metrics || [];
    return selected.indexOf(m.key) >= 0;
  }

  render() {
    const { show, metric, onDismiss } = this.props;

    return ( < SkyLightStateless isVisible = { show }
      onCloseClicked = { onDismiss }
      title = { 'Metrics' }
      dialogStyles = {
        {
          top: '40%',
          width: '70%',
          height: 460,
          marginLeft: '-35%',
          zIndex: 9999,
          overflowY: 'scroll'
        }
      } >
      <div className="row">
          {METRICS_UI_INFO.map((m, key) => (
            <div key={key} className="col-lg-4 col-md-6 col-sm-12 col-xs-12" style={{marginBottom: 20}} onClick={() => !this.isMetricDisabled(m) ? this._onAddMetric(m) : null}>  
              <div className={this.isMetricDisabled(m) ? 'scheduler-metric-dialog__item disabled' : 'scheduler-metric-dialog__item enable'}>
                <div className="row vertical-align">
                  <div className="col-xs-2">
                    <i className={ [m.icon, 'flaticon-2x'].join(' ') }></i>
                  </div>
                  <div className="col-xs-10">
                    <span style={{
                      fontSize: 14,
                      fontWeight: 'lighter',
                      lineHeight: '40px'
                    }}>{ m.name }</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div> < div className = "row" >
      <div className="col-md-2" >
            <button className="btn btn-white btn-block" onClick={onDismiss}>Cancel</button> 
          </div> < /div>  < /SkyLightStateless>
    );
  }
}

export default SchedulerMetricDialog;
