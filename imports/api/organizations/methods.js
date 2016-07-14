import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import _ from 'lodash';
import moment from 'moment';

import { Organizations, STATUS_ACTIVE, STATUS_INACTIVE } from './index';
import { IDValidator } from '/imports/utils';
import * as ERROR_CODE from '/imports/utils/error_code';

/**
 * CUD Organizations (Create, Edit, Deactivate)
 * Methods:
 * # create
 * # edit (name, description, imageUrl, address)
 * # setStatus
 */
// Create Organization
// with basics information: name
export const create = new ValidatedMethod({
  name: 'organizations.create',
  validate: Organizations.schema.validator(),
  run(doc) {
    if (!Meteor.userId()) throw new Meteor.Error(ERROR_CODE.UNAUTHORIZED);

    // validate startTime and endTime


    if(!this.isSimulation) {
      return Organizations.insert(doc);
    }
  }
});

// Edit Organization's name, description, imageUrl, address
export const update = new ValidatedMethod({
  name: 'organizations.update',
  validate: new SimpleSchema({
    ...IDValidator,
    name: {
      type: String,
      optional: true
    },
    description: {
      type: String,
      optional: true
    },
    startTime: {
      type: Date,
      optional: true,
    },
    endTime: {
      type: Date,
      optional: true,
    },
    isPresent: {
      type: Boolean,
      optional: true,
    },
    imageUrl: {
      type: String,
      optional: true
    }
  }).validator(),
  run(data) {
    if (!Meteor.userId())
      throw new Meteor.Error(ERROR_CODE.UNAUTHORIZED);

    // check time
    if(data.startTime && data.endTime) {
      if(data.startTime.getTime() >= data.endTime.getTime()) {
        throw new Meteor.Error('ORGANIZATION_INVALID_RANGE', 'End time should greater than start time');
      }
    }

    if (!this.isSimulation) {
      var selector = { _id: data._id };
      var modifier = {
        $set: _.omit(data, '_id')
      };

      var org = Organizations.findOne({ _id: data._id });

      if (!org) {
        throw new Meteor.Error(404, 'Organization not found');
      } else if (org.owner != Meteor.userId()) {
        throw new Meteor.Error(403, 'Permission Denied');
      } else if (!_.isEmpty(modifier)) {
        return Organizations.update(selector, modifier);
      } else {
        return true;
      }
    }
  }
});


// Edit Organization's name, description, imageUrl, address
export const remove = new ValidatedMethod({
  name: 'organizations.remove',
  validate: new SimpleSchema({
    ...IDValidator,
  }).validator(),
  run({ _id }) {
    if (!Meteor.userId()) {
      throw new Meteor.Error(ERROR_CODE.UNAUTHORIZED);
    }

    if (!this.isSimulation) {
      var selector = { _id };
      var org = Organizations.findOne(selector);

      if (!org) {
        throw new Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND, 'Organization not found');
      } else if (org.owner != Meteor.userId()) {
        throw new Meteor.Error(ERROR_CODE.PERMISSION_DENIED, 'Permission Denied');
      } else {
        return Organizations.remove(selector);
      }
    }
  }
});
