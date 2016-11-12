import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

// collections
import {Accounts} from 'meteor/accounts-base';
import {Organizations} from '/imports/api/organizations/index';
import {Employees} from '/imports/api/employees/index';
import {LogsEmail} from '/imports/api/logs/index';

// components
import Spinner from '/imports/ui/common/Spinner';
import LineChart from '/imports/ui/components/LineChart';

// methods
import {measureAdminStatistic} from '/imports/api/measures/methods';

export default class StatisticComponent extends Component {
  constructor() {
    super();

    this.state = {
      ready: false,
      errors: null,
      statistic: {}
    };
  }

  componentWillMount() {
    measureAdminStatistic.call({params: {days: 7}}, (error, statistic) => {
      if (!error) {
        this.setState({
          ready: true,
          statistic
        });
      } else {
        this.setState({
          ready: true,
          errors: error.reason
        });
      }
    });
  }

  render() {
    const
      {ready, errors, statistic} = this.state
      ;

    // console.log(this.props)

    if (ready) {
      const
        {
          labels,
          users, organizations, employees,
          emailRegistration,
          emailForgotAlias, emailForgotPassword,
          emailSurveys, emailScoringErrors, emailFeedbackToLeaders,
          emailFeedbackToEmployees,
          emailWeeklyDigest,
          emailReferral
        } = statistic,
        newCreationDataSets = [
          {
            data: users,
            fillColor: "rgba(26,179,148,0.5)",
            strokeColor: "rgba(26,179,148,0.7)",
            pointColor: "rgba(26,179,148,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(26,179,148,1)",
          },
          {
            data: organizations,
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
          },
        ]
        ;

      return (
        <div>
          <LineChart
            labels={labels}
            datasets={newCreationDataSets}
          />
          <a className="btn btn-primary btn-bitbucket"></a> Users
          <br/>
          <a className="btn btn-default btn-bitbucket"
             style={{backgroundColor: '#DCDCDC', borderColor: '#DCDCDC', color: '#FFFFFF'}}></a> Organizations
        </div>
      );
    } else {
      return (
        <Spinner/>
      );
    }
  }
}

// export default StatisticContainer = createContainer((params) => {
//   // const
//   //   today = new Date(),
//   //   year = today.getFullYear(),
//   //   month = today.getMonth(),
//   //   day = today.getDate(),
//   //   currentDay = new Date(year, month, day),
//   //   lastWeek = new Date(moment(currentDay).subtract(7, 'days')),
//   //
//   //   subUsers = Meteor.subscribe("statistic.users"),
//   //   subEmployees = Meteor.subscribe("statistic.employees"),
//   //   subOrganizations = Meteor.subscribe("statistic.organizations"),
//   //   subLogsEmail = Meteor.subscribe("logs.email"),
//   //
//   //   timeComparison = {$gte: lastWeek},
//   //   users = Accounts.users.find({createdAt: timeComparison}).fetch(),
//   //   employees = Employees.find({createdAt: timeComparison}).fetch(),
//   //   organizations = Organizations.find({createdAt: timeComparison}).fetch(),
//   //   emailLogs = LogsEmail.find({date: timeComparison}).fetch()
//   //   ;
//   //
//   // console.log({today, currentDay, lastWeek})
//   // return {
//   //   ready: subUsers.ready() & subEmployees.ready() & subOrganizations.ready() & subLogsEmail.ready(),
//   //   users,
//   //   employees,
//   //   organizations,
//   //   emailLogs
//   // };
//   let
//     ready: false,
//     errors: null,
//     statistic: {}
//   ;
//
//   measureAdminStatistic.call({params: {days: 7}}, (error, statistic) => {
//     if(!error) {
//       ready = statistic.ready;
//       statistic = statistic;
//     } else {
//       errors = error.reason;
//     }
//   });
//
//   return {
//     ready,
//     errors,
//     statistic
//   };
//
// }, StatisticComponent);