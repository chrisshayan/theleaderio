import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {FlowRouter} from 'meteor/kadira:flow-router';

// collections
import {Measures} from '/imports/api/measures/index';
import {Feedbacks} from '/imports/api/feedbacks/index';

// components
import Spinner from '/imports/ui/common/Spinner';
import {NoticeForm} from '/imports/ui/common/NoticeForm';
import IboxContentChartWithChosen from '/imports/ui/components/IboxContentChartWithChosen';
import IboxDashboard from '/imports/ui/components/IboxDashboard';

// functions
import {getChartData} from '/imports/api/measures/methods';

class DashboardOrganization extends Component {
  constructor() {
    super();

    this.state = {
      ready: false,
      error: "",
      chartContent: {}
    };
  }

  componentWillMount() {
    const
      leaderId = Meteor.userId(),
      organizationId = FlowRouter.getQueryParam("t"),
      date = new Date(),
      noOfMonths = 6
      ;

    getChartData.call({leaderId, organizationId, date, noOfMonths}, (err, result) => {
      if (!err) {
        this.setState({
          ready: true,
          chartContent: result
        });
      } else {
        this.setState({
          error: err.reason
        });
      }
    });
  }

  render() {
    const
      {
        containerReady,
        measures,
        feedbacks
      } = this.props,
      {
        ready,
        chartContent,
        error
      } = this.state
      ;
    let
      noOfFeedbacks = "",
      noOfGoodScores = "",
      noOfBadScores = ""
      ;

    if (!_.isEmpty(error)) {
      return (
        <div>
          <NoticeForm
            code='404'
            message={error}
            description='Sorry, but the page you are looking for has note been found. Try checking the URL for error, then hit the refresh button on your browser or try found something else in our app.'
            buttonLabel='Come back to HomePage'
            redirectUrl='/'
          />
        </div>
      );
    }

    if (ready & containerReady) {
      if (!_.isEmpty(measures)) {
        noOfGoodScores = accounting.formatNumber(measures.value.noOfGoodScores);
        noOfBadScores = accounting.formatNumber(measures.value.noOfBadScores);
      }
      if (feedbacks > 0) {
        noOfFeedbacks = accounting.formatNumber(feedbacks.count());
      }

      return (
        <div className="animated fadeInRight">
          <div className="row">
            <div className="col-md-4">
              <IboxDashboard
                interval="Monthly"
                label="Good score"
                content={noOfGoodScores}
                description="point in 4 and 5"
              />
            </div>
            <div className="col-md-4">
              <IboxDashboard
                interval="Monthly"
                label="Bad score"
                content={noOfBadScores}
                description="point from 1 to 3"
              />
            </div>
            <div className="col-md-4">
              <IboxDashboard
                interval="Monthly"
                label="Feedbacks"
                content={noOfFeedbacks}
                description="from employees"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="ibox float-e-margins">
                <IboxContentChartWithChosen
                  label="Half-year Metric Progress Chart"
                  data={chartContent}
                  value={chartContent.overall}
                />
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

export default DashboardOrganizationContainer = createContainer(function () {
  const
    leaderId = Meteor.userId(),
    organizationId = FlowRouter.getQueryParam("t"),
    date = new Date(),
    year = date.getFullYear(),
    month = date.getMonth()
  subMeasures = Meteor.subscribe("measures"),
    subFeedbacks = Meteor.subscribe("feedbacks")
  ;
  let
    containerReady = false,
    query = {},
    projection = {},
    measures = {},
    feedbacks = null
    ;

  query = {
    leaderId,
    organizationId,
    type: "metric",
    interval: "monthly",
    year,
    month
  };
  projection = {key: 1, value: 1};
  measures = Measures.find(query, projection).fetch();

  query = {
    leaderId,
    organizationId,
    date: {
      $gte: new Date(year, month, 1),
      $lt: new Date(year, month + 1, 1)
    }
  };
  projection = {
    employeeId: 1,
    metric: 1,
    feedback: 1
  };
  feedbacks = Feedbacks.find(query, projection).count();

  containerReady = subMeasures.ready() & subFeedbacks.ready();

  return {
    containerReady,
    measures,
    feedbacks
  };
}, DashboardOrganization);