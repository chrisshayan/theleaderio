import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {words as capitalize} from 'capitalize';

// collections
import {Scheduler, INTERVAL, METRICS, QUARTER} from '/imports/api/scheduler/index';

// constants
import {DEFAULT_METRICS} from '/imports/utils/defaults';

// components
import Spinner from '/imports/ui/common/Spinner';
import Chosen from '/imports/ui/components/Chosen';

class SchedulerComponent extends Component {

  _onIntervalSelected() {

  }

  _onStart() {

  }

  _onEdit() {

  }

  render() {
    const {loading, scheduler, metrics, interval} = this.props;
    console.log(metrics);

    if (!loading) {
      return (
        <div className="wrapper wrapper-content  animated fadeInRight">
          <div className="row">
            <div className="col-lg-3" style={{paddingLeft: 10, paddingRight: 10}}>
              <div className="ibox">
                <div className="ibox-content">
                  <h3>Quarter 1</h3>
                  <p className="small"><i className="fa fa-hand-o-up"></i> Choose the interval for sending email</p>
                  <Chosen
                    options={interval}
                    selectedOptions={null}
                    chosenClass="chosen-select"
                    isMultiple={false}
                    placeHolder=''
                    onChange={this._onIntervalSelected.bind(this)}
                  />
                  <div className="input-group">
                    <input type="text" placeholder="Add new task. " className="input input-sm form-control"/>
                                <span className="input-group-btn">
                                        <button type="button" className="btn btn-sm btn-white"> <i
                                          className="fa fa-plus"></i> Add task</button>
                                </span>
                  </div>

                  <ul className="sortable-list connectList agile-list" id="todo">
                    <li className="warning-element" id="task1">
                      Simply dummy text of the printing and typesetting industry.
                      <div className="agile-detail">
                        <a href="#" className="pull-right btn btn-xs btn-white">Tag</a>
                        <i className="fa fa-clock-o"></i> 12.10.2015
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-3" style={{paddingLeft: 10, paddingRight: 10}}>
              <div className="ibox">
                <div className="ibox-content">
                  <h3>Quarter 2</h3>
                  <p className="small"><i className="fa fa-hand-o-up"></i> Choose the interval for sending email</p>
                  <Chosen
                    options={interval}
                    selectedOptions={null}
                    chosenClass="chosen-select"
                    isMultiple={false}
                    placeHolder=''
                    onChange={this._onIntervalSelected.bind(this)}
                  />
                  <div className="input-group">
                    <input type="text" placeholder="Add new task. " className="input input-sm form-control"/>
                                <span className="input-group-btn">
                                        <button type="button" className="btn btn-sm btn-white"> <i
                                          className="fa fa-plus"></i> Add task</button>
                                </span>
                  </div>

                  <ul className="sortable-list connectList agile-list" id="todo">
                    <li className="warning-element" id="task1">
                      Simply dummy text of the printing and typesetting industry.
                      <div className="agile-detail">
                        <a href="#" className="pull-right btn btn-xs btn-white">Tag</a>
                        <i className="fa fa-clock-o"></i> 12.10.2015
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-3" style={{paddingLeft: 10, paddingRight: 10}}>
              <div className="ibox">
                <div className="ibox-content">
                  <h3>Quarter 3</h3>
                  <p className="small"><i className="fa fa-hand-o-up"></i> Choose the interval for sending email</p>
                  <Chosen
                    options={interval}
                    selectedOptions={null}
                    chosenClass="chosen-select"
                    isMultiple={false}
                    placeHolder=''
                    onChange={this._onIntervalSelected.bind(this)}
                  />
                  <div className="input-group">
                    <input type="text" placeholder="Add new task. " className="input input-sm form-control"/>
                                <span className="input-group-btn">
                                        <button type="button" className="btn btn-sm btn-white"> <i
                                          className="fa fa-plus"></i> Add task</button>
                                </span>
                  </div>

                  <ul className="sortable-list connectList agile-list" id="todo">
                    <li className="warning-element" id="task1">
                      Simply dummy text of the printing and typesetting industry.
                      <div className="agile-detail">
                        <a href="#" className="pull-right btn btn-xs btn-white">Tag</a>
                        <i className="fa fa-clock-o"></i> 12.10.2015
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-3" style={{paddingLeft: 10, paddingRight: 10}}>
              <div className="ibox">
                <div className="ibox-content">
                  <h3>Quarter 4</h3>
                  <p className="small"><i className="fa fa-hand-o-up"></i> Choose the interval for sending email</p>
                  <Chosen
                    options={interval}
                    selectedOptions={null}
                    chosenClass="chosen-select"
                    isMultiple={false}
                    placeHolder=''
                    onChange={this._onIntervalSelected.bind(this)}
                  />
                  <div className="input-group">
                    <input type="text" placeholder="Add new task. " className="input input-sm form-control"/>
                                <span className="input-group-btn">
                                        <button type="button" className="btn btn-sm btn-white"> <i
                                          className="fa fa-plus"></i> Add task</button>
                                </span>
                  </div>

                  <ul className="sortable-list connectList agile-list" id="todo">
                    <li className="warning-element" id="task1">
                      Simply dummy text of the printing and typesetting industry.
                      <div className="agile-detail">
                        <a href="#" className="pull-right btn btn-xs btn-white">Tag</a>
                        <i className="fa fa-clock-o"></i> 12.10.2015
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
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

export default SchedulerContainer = createContainer((params) => {
  // subscribe
  const subScheduler = Meteor.subscribe('scheduler');

  // loading
  const loading = !subScheduler.ready() || !Meteor.userId() || Meteor.loggingIn();

  // data
  const userId = Meteor.userId();
  const selector = {};
  const scheduler = Scheduler.find(selector).fetch();
  const schedulerExists = !loading;

  // list metrics
  const metrics = [];
  $.map(METRICS, (value) => {
    metrics.push(capitalize(value.toLowerCase()));
  });
  
  // interval
  const interval = [];
  $.map(INTERVAL, (value) => {
    interval.push(capitalize(value.toLowerCase()));
  });

  return {
    loading,
    scheduler: schedulerExists ? scheduler : {},
    metrics,
    interval
  };

}, SchedulerComponent);