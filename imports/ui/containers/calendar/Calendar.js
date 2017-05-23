import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment-timezone';
import {METRICS_UI_INFO} from '/imports/api/scheduler';
import _ from 'lodash';

const withData = (params) => {
  return {

  };
}

class Calendar extends Component {
  componentDidMount() {
    const { container } = this.refs;
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();


    try {
      $(container).fullCalendar({
        header: {
          left: 'prev,next today',
          center: 'title',
          right: ''
        },
        lazyFetching: true,
        timezone: moment.tz.guess(),
        events: (start, end, timezone, callback) => {
          // console.log(start.toISOString())
          Meteor.call('sendingPlans.getCalendar', {
            start: start.toDate(),
            end: end.toDate(),
            timezone
          }, (error, events) => {
            events = events.map(e => {
              var metric = _.find(METRICS_UI_INFO, {key: e.metric});
              return {
                title: metric.shortName,
                start: e.sendDate,
                allDay: true,
                metric: metric
              };
            });
            callback(events);
          });
        },
        eventRender: (event, el) => {
          var content = `
            <div style="text-align: center;">
              <i class="${event.metric.icon} flaticon-4x"></i>
              <p style="font-size: 16px;text-align: justify">${event.metric.tooltip}</p>
            </div>
          `;
          el.popover({
            title: event.metric.name,
            placement: 'top',
            html: true,
            content: content,
            trigger: 'hover'
          });
        }
      });
    } catch (e) {
      // console.log(e);
    }

  }

  render() {
    return <div ref="container" id="sending-plan-calendar" />;
  }
}

export default createContainer(withData, Calendar);
