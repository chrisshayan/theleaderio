import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Leaderships } from './index';
import { validateUser } from '/imports/api/profiles/method';
import { validateOrg } from '/imports/api/organizations/method';
import { validateEmployee } from '/imports/api/employees/method';
import { IDValidator } from '/imports/utils';

/**
 * CUD Leaderships (Create, Update, Add)
 * Methods:
 * # validateLeadership
 * # addOrganization
 * # addEmployee
 * # editWorkingPeriod
 */
 // validate Leadership
export const validateLeadership = new ValidatedMethod({
  name: 'leaderships.validateLeadership',
  validate: new SimpleSchema({
    ...IDValidator,
    ...IDValidator
  }).validator(),
  run(leadership) {
    const docsNumber = Leaderships.find({
      _id: leadership._id, "organizations.organizationId": leadership.organizationId
    }).count();
    if(!docsNumber) {
      return 0; // Invalid Leadership
    } else {
      return 1; // Valid Leadership
    }
  }
});

// Add Organization
export const addOrganization = new ValidatedMethod({
  name: 'leaderships.addOrganization',
  validate: new SimpleSchema({
    leaderId: {
      type: String
    },
    "organizations.organizationId": {
      type: String  // _id mapped from collection organizations
    }
  }).validator(),
  run(leadership) {
    return Leaderships.insert(leadership);
  }
});

// Add Employees
export const addEmployee = new ValidatedMethod({
  name: 'leaderships.addEmployee',
  validate: new SimpleSchema({
    ...IDValidator,
    employeeId: {
      type: String  // employeeId mapped from collection employees
    }
  }).validator(),
  run(leadership) {
    if(!validateLeadership.call({_id: leadership._id})) {
      throw new Meteor.Error(400, 'Invalid Leadership');
    } else {
      return Leaderships.update({ _id: leadership._id }, {
        $push: { "organizations.employees": leadership.employeeId }});
    }
  }
});

// Update address
export const editWorkingPeriod = new ValidatedMethod({
  name: 'leaderships.editWorkingPeriod',
  validate: new SimpleSchema({
    ...IDValidator,
    organizationId: {
      type: String
    },
    startDate: {
      type: Date,
      optional: true
    },
    endDate: {
      type: Date,
      optional: true
    }
  }).validator(),
  run(leadership) {
    if(!validateLeadership.call({_id: leadership._id, organizationId: leadership.organizationId})) {
      throw new Meteor.Error(400, 'Invalid Leadership');
    } else {
      return Leaderships.update({
        _id: leadership._id, "organizations.organizationId": leadership.organizationId
      }, { $set: { address: employee.address }});
    }
  }
});
