import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {FlowRouter} from 'meteor/kadira:flow-router';

// collections
import {Measures} from '/imports/api/measures/index';
import {Feedbacks} from '/imports/api/feedbacks/index';
import {Employees, STATUS_ACTIVE} from '/imports/api/employees/index';
import {Organizations} from '/imports/api/organizations/index';

// components
import Spinner from '/imports/ui/common/Spinner';
import {NoticeForm} from '/imports/ui/common/NoticeForm';
import IboxDashboard from '/imports/ui/components/IboxDashboard';
import ProfileMetricsBox from '/imports/ui/components/ProfileMetricsBox';

// methods
import {measureMonthlyMetricScore} from '/imports/api/measures/methods';

// functions
import {getChartData} from '/imports/api/measures/methods';
import {getAverageMetrics} from '/imports/api/metrics/functions';

// constants
import {DEFAULT_PUBLIC_INFO_PREFERENCES} from '/imports/utils/defaults';

class DashboardOrganization extends Component {
  constructor() {
    super();

    this.state = {
      ready: false,
      error: "",
      chart: {}
    };
  }

  componentWillMount() {
    const
      leaderId = Meteor.userId(),
      organizationId = this.props.organizationId,
      date = new Date(),
      noOfMonths = 6,
      preferences = {};
      ;

    // measure score of metric every time user access to dashboard
    measureMonthlyMetricScore.call({params: {
      leaderId, organizationId, date
    }});

    getChartData.call({leaderId, organizationId, date, noOfMonths}, (err, result) => {
      if (!err) {
        preferences.metrics = DEFAULT_PUBLIC_INFO_PREFERENCES.metrics;
        this.setState({
          ready: true,
          chart: result,
          preferences
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
        noOfEmployees,
        noOfFeedbacks,
        isCurrentOrg
      } = this.props,
      {
        ready,
        error,
        chart,
        preferences
      } = this.state
      ;
    let
      metrics = {},
      noOfGoodScores = 0,
      noOfBadScores = 0
      ;

    if (!_.isEmpty(measures)) {
      measures.map(measure => {
        noOfGoodScores += measure.value.noOfGoodScores;
        noOfBadScores += measure.value.noOfBadScores;
      });

    }

    // Metrics
    if(!_.isEmpty(chart)) {
      metrics = getAverageMetrics(chart);
    }

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
      return (
        <div className="animated fadeInRight">
          <div className="row">
            <div className="col-md-3">
              <IboxDashboard
                interval="Active"
                label="Team size"
                content={accounting.formatNumber(noOfEmployees)}
                description="employees"
              />
            </div>
            <div className="col-md-3">
              <IboxDashboard
                interval="Monthly"
                label="Good score"
                content={accounting.formatNumber(noOfGoodScores)}
                description="point in 4 and 5"
              />
            </div>
            <div className="col-md-3">
              <IboxDashboard
                interval="Monthly"
                label="Bad score"
                content={accounting.formatNumber(noOfBadScores)}
                description="point from 1 to 3"
              />
            </div>
            <div className="col-md-3">
              <IboxDashboard
                interval="Monthly"
                label="Feedbacks"
                content={accounting.formatNumber(noOfFeedbacks)}
                description="from employees"
              />
            </div>
          </div>
          <div className="row">
            <ProfileMetricsBox
              isPresent={isCurrentOrg}
              label="Half-year leadership progress"
              preferences={preferences.metrics}
              data={{chart, metrics}}
            />
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

export default DashboardOrganizationContainer = createContainer(function (params) {
  const
    leaderId = Meteor.userId(),
    organizationId = params.organizationId,
    date = new Date(),
    year = date.getFullYear(),
    month = date.getMonth(),
    subMeasures = Meteor.subscribe("measures"),
    subEmployees = Meteor.subscribe("employees"),
    subFeedbacks = Meteor.subscribe("feedbacks"),
    subOrg = Meteor.subscribe("organizations.details", {_id: organizationId})
    ;
  let
    containerReady = false,
    query = {},
    projection = {},
    measures = [],
    employees = [],
    feedbacks = [],
    organizations = [],
    noOfEmployees = 0,
    noOfFeedbacks = 0,
    isCurrentOrg = false
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
  measures = Measures.find(query, {fields: projection}).fetch();


  query = {
    leaderId,
    organizationId,
    status: STATUS_ACTIVE
  };
  employees = Employees.find(query).fetch();
  noOfEmployees = employees.length;

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
  feedbacks = Feedbacks.find(query, {fields: projection}).fetch();
  noOfFeedbacks = feedbacks.length;

  projection = {
    isPresent: 1
  }
  organizations = Organizations.find({}, {fields: projection}).fetch();
  if(!_.isEmpty(organizations)) {
    isCurrentOrg = organizations[0].isPresent;
  }

  containerReady = subMeasures.ready() & subFeedbacks.ready() & subEmployees.ready() & subOrg.ready();

  return {
    containerReady,
    measures,
    noOfEmployees,
    noOfFeedbacks,
    isCurrentOrg
  };
}, DashboardOrganization);