import { Meteor,  } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Employees, STATUS_ACTIVE, STATUS_DEACTIVE } from './index';
import { IDValidator } from '/imports/utils';

/**
 * CUD Employees (Create, Update, Deactivate)
 * Methods:
 * # validateOrg
 * # insert
 * # updateName
 * # updateAddress
 * # updateImageUrl
 * # updateStatus
 */
 // validate Employee
export const validateEmployee = new ValidatedMethod({
  name: 'employees.validateEmployee',
  validate: new SimpleSchema({
    ...IDValidator
  }).validator(),
  run(employee) {
    const docsNumber = Employees.find({ _id: employee._id }).count();
    if(!docsNumber) {
      return 0; // Invalid Employee
    } else {
      return 1; // Valid Employee
    }
  }
});

// Create Employee
// with basics information: email, status
export const insert = new ValidatedMethod({
  name: 'employees.insert',
  validate: new SimpleSchema({
    email: {
      type: String
    },
    status: {
      type: String,
      allowedValues: [ STATUS_ACTIVE, STATUS_DEACTIVE ]
    }
  }).validator(),
  run(employee) {
    return Employees.insert(employee);
  }
});

// Update Employee Name
export const updateName = new ValidatedMethod({
  name: 'employees.updateName',
  validate: new SimpleSchema({
    ...IDValidator,
    firstName: {
      type: String
    },
    lastName: {
      type: String
    }
  }).validator(),
  run(employee) {
    if(!validateEmployee.call({_id: employee._id})) {
      throw new Meteor.Error(400, 'Invalid Employee');
    } else {
      return Employees.update({ _id: employee._id }, {
        $set: { firstName: employee.firstName, lastName: employee.lastName }});
    }
  }
});

// Update address
export const updateAddress = new ValidatedMethod({
  name: 'employees.updateAddress',
  validate: new SimpleSchema({
    ...IDValidator,
    "address.zipCode": {
      type: String,
      optional: true
    },
    "address.countryCode": {
      type: String,
      optional: true
    },
    "address.country": {
      type: String,
      optional: true
    },
    "address.city": {
      type: String,
      optional: true
    },
    "address.district": {
      type: String,
      optional: true
    },
    "address.streetName": {
      type: String,
      optional: true
    },
    "address.streetAddress": {
      type: String,
      optional: true
    },
    "address.secondaryAddress": {
      type: String,
      optional: true
    },
    "address.geo.latitude": {
      type: String,
      optional: true
    },
    "address.geo.longitude": {
      type: String,
      optional: true
    }
  }).validator(),
  run(employee) {
    if(!validateEmployee.call({_id: employee._id})) {
      throw new Meteor.Error(400, 'Invalid User');
    } else {
      return Employees.update({ _id: employee._id }, {
        $set: { address: employee.address }});
    }
  }
});

// Update Employee ImageUrl
export const updateImageUrl = new ValidatedMethod({
  name: 'employees.updateImageUrl',
  validate: new SimpleSchema({
    ...IDValidator,
    imageUrl: {
      type: String
    }
  }).validator(),
  run(employee) {
    if(!validateEmployee.call({_id: employee._id})) {
      throw new Meteor.Error(400, 'Invalid Employee');
    } else {
      return Employees.update({ _id: employee._id }, {
        $set: { imageUrl: employee.imageUrl }});
    }
  }
});

// Update Employee Status ( Activate or Deactivate)
export const updateStatus = new ValidatedMethod({
  name: 'employees.updateStatus',
  validate: new SimpleSchema({
    ...IDValidator,
    status: {
      type: String,
      allowedValues: [  STATUS_ACTIVE, STATUS_DEACTIVE ]
    }
  }).validator(),
  run(employee) {
    if(!validateEmployee.call({_id: employee._id})) {
      throw new Meteor.Error(400, 'Invalid Employee');
    } else {
      return Employees.update({ _id: employee._id }, {
        $set: { status: employee.status }});
    }
  }
});
