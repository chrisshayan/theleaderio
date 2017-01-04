import {Meteor} from 'meteor/meteor';
import {Scheduler} from '/imports/api/scheduler/index';
import {generateSendingPlan} from '/imports/api/migration/functions';

Migrations.add({
  version: 4,
  name: "generate sending plan for new year",
  up() {
    const {enable: shouldGeneratePlan, year} = Meteor.settings.generatePlan;
    if(shouldGeneratePlan) {
      generateSendingPlan({year});
    }
  }
});