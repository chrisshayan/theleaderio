import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import _ from 'lodash';

import { Employees, STATUS_ACTIVE, STATUS_DEACTIVE } from './index';
import { IDValidator } from '/imports/utils';
import validate from '/imports/utils/validate';

// functions
import {add as addLogs} from '/imports/api/logs/functions';

/**
 * CUD Employees (Create, Update, Deactivate)
 * Methods:
 * # create
 * # edit ( email, firstName, lastName, imageUrl)
 * # setStatus
 */

// Create Employee
// with basics information: email, firstName, lastName
export const create = new ValidatedMethod({
  name: 'employees.create',
  validate: validate.methodValidator({
    firstName: {
      presence: true,
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    email: {
      presence: true,
      type: 'string',
      email: true,
    }
  }),
  run({ email, firstName, lastName }) {
    var employee = { email, firstName };
    if (lastName != undefined) {
      employee['lastName'] = lastName;
    }
    return Employees.insert(employee);
  }
});

// Edit Employee's Email, firstName, lastName, ImageUrl
export const edit = new ValidatedMethod({
  name: 'employees.edit',
  validate: new SimpleSchema({
    ...IDValidator,
    email: {
      type: String,
      optional: true
    },
    firstName: {
      type: String,
      optional: true
    },
    lastName: {
      type: String,
      optional: true
    },
    imageUrl: {
      type: String,
      optional: true
    }
  }).validator(),
  run({_id, email, firstName, lastName, imageUrl}) {
    const updatedAt = new Date();
    var selector = { _id };
    var modifier = {};
    if (email != undefined) {
      modifier['email'] = email;
    }
    if (firstName != undefined) {
      modifier['firstName'] = firstName;
    }
    if (lastName != undefined) {
      modifier['lastName'] = lastName;
    }
    if (imageUrl != undefined) {
      modifier['imageUrl'] = imageUrl;
    }
    modifier["updatedAt"] = updatedAt;
    var employee = Employees.findOne(selector);
    if(!employee) {
      throw new Meteor.Error(404, 'Employee not found');
    } else if(!_.isEmpty(modifier)) {
      return Employees.update(selector, {$set: modifier})
    } else {
      return true;
    }
  }
});

// Set Employee's Status ( Activate or Deactivate)
export const setStatus = new ValidatedMethod({
  name: 'employees.setStatus',
  validate: new SimpleSchema({
    ...IDValidator,
    status: {
      type: String,
      allowedValues: [  STATUS_ACTIVE, STATUS_DEACTIVE ]
    }
  }).validator(),
  run({ _id, status }) {
    var employee = Employees.findOne({ _id });
    const updatedAt = new Date();
    if(!employee) {
      throw new Meteor.Error(404, 'Employee not found');
    } else {
      return Employees.update({ _id }, { $set: { status, updatedAt }});
    }
  }
});
