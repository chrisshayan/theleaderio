import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

// collections
import {Accounts} from 'meteor/accounts-base';
import {Employees} from '/imports/api/employees/index';

// components
import Spinner from '/imports/ui/common/Spinner';

class StatisticComponent extends Component {
  render() {
    const
      {ready, users, employees} = this.props
      ;

    console.log(users)
    console.log(employees)
    if(ready) {
      return (
        <div>
          Statistic data ready
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
    subUsers = Meteor.subscribe("statistic.users"),
    subEmployees = Meteor.subscribe("statistic.employees"),
    users = Accounts.users.find().fetch(),
    employees = Employees.find().fetch()
  ;

  return {
    ready: subUsers.ready() & subEmployees.ready(),
    users,
    employees
  };
}, StatisticComponent);