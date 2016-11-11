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
import MorrisAreaChart from '/imports/ui/components/MorrisAreaChart';

class StatisticComponent extends Component {
  constructor() {
    super();

    this.state = {
      labels: [],
      usersData: [],
      organizationsData: [],
      employeesData: [],
      emailData: {
        register: {
          welcome: []
        },
        userSupport: {
          forgotPassword: [],
          forgotAlias: []
        },
        toEmployees: {
          survey: [],
          feedback: [],
          scoringError: []
        },
        toLeaders: {
          feedback: []
        },
        referrals: {
          referrals: []
        }
      }
    };
  }

  render() {
    const
      {ready, users, employees} = this.props
      ;

    console.log(this.props)
    if (ready) {
      return (
        <div>
          Line Chart
        </div>
      );
    } else {
      return (
        <Spinner/>
      );
    }
  }
}

export default StatisticContainer = createContainer((params) => {
  const
    today = new Date(),
    year = today.getFullYear(),
    month = today.getMonth(),
    day = today.getDate(),
    currentDay = new Date(year, month, day),
    lastWeek = new Date(moment(currentDay).subtract(7, 'days')),

    subUsers = Meteor.subscribe("statistic.users"),
    subEmployees = Meteor.subscribe("statistic.employees"),
    subOrganizations = Meteor.subscribe("statistic.organizations"),
    subLogsEmail = Meteor.subscribe("logs.email"),

    timeComparison = {$gte: lastWeek},
    users = Accounts.users.find({createdAt: timeComparison}).fetch(),
    employees = Employees.find({createdAt: timeComparison}).fetch(),
    organizations = Organizations.find({createdAt: timeComparison}).fetch(),
    emailLogs = LogsEmail.find({date: timeComparison}).fetch()
    ;

  console.log({today, currentDay, lastWeek})
  return {
    ready: subUsers.ready() & subEmployees.ready() & subOrganizations.ready() & subLogsEmail.ready(),
    users,
    employees,
    organizations,
    emailLogs
  };
}, StatisticComponent);