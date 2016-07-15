import React, {Component} from 'react';

export default class LeadershipProgress extends Component {
  render() {
    return (
      <div className="ibox float-e-margins">
        <div className="ibox-title">
          <span className="label label-info pull-right">July 14, 2016</span>
          <h5>Leadership progress (not implemented)</h5>
        </div>
        <div className="ibox-content">
          <div className="row">
            <div className="col-xs-3">
              <small className="stats-label">Overall</small>
              <h4>1.8</h4>
            </div>

            <div className="col-xs-3">
              <small className="stats-label">Purpose</small>
              <h4>6.1</h4>
            </div>
            <div className="col-xs-3">
              <small className="stats-label">Meetings</small>
              <h4>2.0</h4>
            </div>
            <div className="col-xs-3">
              <small className="stats-label">Rules</small>
              <h4>2.0</h4>
            </div>
          </div>
        </div>
        <div className="ibox-content">
          <div className="row">
            <div className="col-xs-3">
              <small className="stats-label">Communication</small>
              <h4>1.1</h4>
            </div>

            <div className="col-xs-3">
              <small className="stats-label">Leadership</small>
              <h4>9.4</h4>
            </div>
            <div className="col-xs-3">
              <small className="stats-label">Workload</small>
              <h4>5.4</h4>
            </div>
            <div className="col-xs-3">
              <small className="stats-label">Energy</small>
              <h4>4.1</h4>
            </div>
          </div>
        </div>
        <div className="ibox-content">
          <div className="row">
            <div className="col-xs-3">
              <small className="stats-label">Stress</small>
              <h4>7.2</h4>
            </div>

            <div className="col-xs-3">
              <small className="stats-label">Decision</small>
              <h4>5.2</h4>
            </div>
            <div className="col-xs-3">
              <small className="stats-label">Respect</small>
              <h4>4.9</h4>
            </div>
            <div className="col-xs-3">
              <small className="stats-label">Conflict</small>
              <h4>3.1</h4>
            </div>
          </div>
        </div>
      </div>
    );
  }
}