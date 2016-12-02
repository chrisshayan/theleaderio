import {SendingPlans} from '/imports/api/sending_plans/index';
import moment from 'moment';
import {Accounts} from 'meteor/accounts-base';
import {Employees} from '/imports/api/employees/index';

/**
 * Function get the list of leaders who have sending plan in last week
 * @return {Array} list of leaderId
 */
export const getLeaderForDigestEmail = ({params}) => {
  const
    {startDate, endDate} = params,
    plans = SendingPlans.find({status: {$not: /READY/}, sendDate: {$gte: startDate, $lt: endDate}}).fetch()
    // plans = SendingPlans.find({leaderId: "zFwXqkDoCD9QbiR8K", status: {$not: /READY/}, sendDate: {$gte: startDate, $lt: endDate}}).fetch()
    ;
  let
    listOfLeaders = [];

  if (!_.isEmpty(plans)) {
    plans.map(plan => {
      if (_.indexOf(listOfLeaders, plan.leaderId) === -1) {
        listOfLeaders.push(plan.leaderId);
      }
    });
  }

  return listOfLeaders;
};

/**
 * Function get the type of user by email
 * @param email
 * @return {{isLeader: boolean, isEmployee: boolean}}
 */
export const getUserTypeByEmail = (email) => {
  const
    leader = Accounts.findUserByEmail(email),
    employee = Employees.findOne({email}),
    result = {
      isLeader: !_.isEmpty(leader) ? true : false,
      isEmployee: !_.isEmpty(employee) ? true : false,
    }
    ;

  return result;
};
