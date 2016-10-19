import {SendingPlans} from '/imports/api/sending_plans/index';
import moment from 'moment';

/**
 * Function get the list of leaders who have sending plan in last week
 * @return {Array} list of leaderId
 */
export const getLeaderForDigestEmail = ({params}) => {
  const
    {startDate} = params,
    endDate = new Date(),
    plans = SendingPlans.find({leaderId: "frYPNtXtBi2u6nC99", sendDate: {$gte: startDate, $lt: endDate}}).fetch()
    // plans = SendingPlans.find({sendDate: {$gte: startDate, $lt: endDate}}).fetch()
    ;
  let
    listOfLeaders = [];

  if(!_.isEmpty(plans)) {
    plans.map(plan => {
      if(_.indexOf(listOfLeaders, plan.leaderId) === -1) {
        listOfLeaders.push(plan.leaderId);
      }
    });
  }

  return listOfLeaders;
}