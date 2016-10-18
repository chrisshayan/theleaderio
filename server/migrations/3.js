import { SendingPlans } from '/imports/api/sending_plans';
import { Profiles } from '/imports/api/profiles';
import moment from 'moment-timezone';

Migrations.add({
  version: 3,
  up() {
    var plans = SendingPlans.find({ status: 'READY' }).fetch();
    plans.forEach(plan => {
      let hasChanged = false;
      var sendDate = moment(plan.sendDate).tz(plan.timezone);
      if (sendDate.day() == 6) {
        sendDate.subtract(1, 'day');
        hasChanged = true;
      } else if (sendDate.day() == 7) {
        sendDate.add(1, 'day');
        hasChanged = true;
      }
      if (hasChanged) {
        SendingPlans.update({ _id: plan._id }, {
          $set: {
            sendDate: sendDate.toDate()
          }
        });
      }
    });
  }
});
