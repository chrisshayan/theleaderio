import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Employees, STATUS_ACTIVE, STATUS_DEACTIVE } from './index';
import { IDValidator } from '/imports/utils';

/**
 * CUD Employees (Create, Update, Deactivate)
 * Methods:
 * # validateEmployee
 * # createEmployee
 * # editName
 * # editAddress
 * # editImageUrl
 * # editStatus
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
export const createEmployee = new ValidatedMethod({
  name: 'employees.createEmployee',
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

// Edit Employee Name
export const editName = new ValidatedMethod({
  name: 'employees.editName',
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

// Edit Address
export const editAddress = new ValidatedMethod({
  name: 'employees.editAddress',
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

// Edit Employee ImageUrl
export const editImageUrl = new ValidatedMethod({
  name: 'employees.editImageUrl',
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

// Edit Employee Status ( Activate or Deactivate)
export const editStatus = new ValidatedMethod({
  name: 'employees.editStatus',
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
