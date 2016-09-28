import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {ValidationError} from 'meteor/mdg:validation-error';
import validate from '/imports/utils/validate';
import {UserLoggedInMixin, MethodValidatorMixin} from '/imports/utils/mixins';

// collections
import {Scheduler} from '/imports/api/scheduler/index';

// constants
import * as ERROR_CODE from '/imports/utils/error_code';


const constraints = {
  metrics: {
    type: "array",
    presence: true
  },
  quarter: {
    type: "string",
    presence: true
  },
  schedule: {
    type: "string",
  },
  status: {
    type: "string"
  }
};

/**
 * CUD Scheduler (Create, Edit, Deactivate)
 * Methods:
 * # create
 * # edit (name, description, imageUrl, address)
 * # setStatus
 */
// Create scheduler
// with basics information: name
export const create = new ValidatedMethod({
  name: 'scheduler.create',
  validate: validate.methodValidator(constraints),
  run({year, quarter, schedule, metrics, status}) {
    if (!Meteor.userId()) throw new Meteor.Error(ERROR_CODE.UNAUTHORIZED);
    if (!this.isSimulation) {
      const userId = Meteor.userId();
      return Scheduler.insert({userId, year, quarter, schedule, metrics, status});
    }
  }
});

// Create scheduler for migrating data
// with basics information: name
export const createForMigration = new ValidatedMethod({
  name: 'scheduler.createForMigration',
  validate: validate.methodValidator(constraints),
  run({userId, year, quarter, schedule, metrics, status}) {
    if (!this.isSimulation) {
      return Scheduler.insert({userId, year, quarter, schedule, metrics, status});
    }
  }
});

// Edit scheduler
// Edit Organization's name, description, imageUrl, address
export const edit = new ValidatedMethod({
  name: 'scheduler.edit',
  validate: validate.methodValidator({
    ...constraints,
    _id: {
      type: 'string',
      presence: true
    }
  }),
  run({_id, year, quarter, schedule, metrics, status}) {
    if (!Meteor.userId())
      throw new Meteor.Error(ERROR_CODE.UNAUTHORIZED);

    if (!this.isSimulation) {
      const selector = {_id: _id};
      const modifier = {
        $set: {year, quarter, schedule, metrics, status}
      };

      const schedule = Scheduler.findOne({_id: _id});

      if (!schedule) {
        throw new Meteor.Error(404, ERROR_CODE.RESOURCE_NOT_FOUND);
      } else if (schedule.userId != Meteor.userId()) {
        throw new Meteor.Error(403, ERROR_CODE.PERMISSION_DENIED);
      } else if (!_.isEmpty(modifier)) {
        return Scheduler.update(selector, modifier);
      } else {
        return true;
      }
    }
  }
});


export const addMetricToQuarter = new ValidatedMethod({
  name: 'scheduler.addMetricToQuarter',
  mixins: [MethodValidatorMixin, UserLoggedInMixin],
  rules: {
    schedulerId: {
      type: 'string',
      presence: true
    },
    metric: {
      type: 'string',
      presence: true
    }
  },
  run({ schedulerId, metric }) {
    if(!this.isSimulation) {
      const selector = {_id: schedulerId};
      const modifier = {
        $addToSet: {
          metrics: metric
        }
      };
      const scheduler = Scheduler.findOne(selector);
      if(!scheduler) throw new Meteor.Error(404, 'Scheduler not found');
      return Scheduler.update(selector, modifier);
    }
    return true;
  }
});


export const removeMetricOfQuarter = new ValidatedMethod({
  name: 'scheduler.removeMetricOfQuarter',
  mixins: [MethodValidatorMixin, UserLoggedInMixin],
  rules: {
    schedulerId: {
      type: 'string',
      presence: true
    },
    metric: {
      type: 'string',
      presence: true
    }
  },
  run({ schedulerId, metric }) {
    if(!this.isSimulation) {
      const selector = {_id: schedulerId};
      const modifier = {
        $pull: {
          metrics: metric
        }
      };
      const scheduler = Scheduler.findOne(selector);
      if(!scheduler) throw new Meteor.Error(404, 'Scheduler not found');
      return Scheduler.update(selector, modifier);
    }
    return true;
  }
});


export const changeInterval = new ValidatedMethod({
  name: 'scheduler.changeInterval',
  mixins: [MethodValidatorMixin, UserLoggedInMixin],
  rules: {
    schedulerId: {
      type: 'string',
      presence: true
    },
    interval: {
      type: 'string',
      presence: true
    }
  },
  run({ schedulerId, interval }) {
    if(!this.isSimulation) {
      const selector = {_id: schedulerId};
      const modifier = {
        $set: {
          interval
        }
      };
      const scheduler = Scheduler.findOne(selector);
      if(!scheduler) throw new Meteor.Error(404, 'Scheduler not found');
      return Scheduler.update(selector, modifier);
    }
    return true;
  }
});
