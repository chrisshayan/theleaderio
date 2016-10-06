import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { ValidationError } from 'meteor/mdg:validation-error';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import _ from 'lodash';

import { Organizations } from './index';
import { Employees, STATUS_ACTIVE, STATUS_DEACTIVE } from '/imports/api/employees';
import { IDValidator } from '/imports/utils';
import * as ERROR_CODE from '/imports/utils/error_code';
import validate from '/imports/utils/validate';
import { UserLoggedInMixin, MethodValidatorMixin } from '/imports/utils/mixins';

const constraints = {
  name: {
    presence: true,
    type: "string",
  },
  description: {
    type: "string"
  },
};

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
  validate: validate.methodValidator(constraints),
  run({ name, jobTitle, description, imageUrl, startTime, endTime, isPresent }) {
    if (!Meteor.userId()) throw new Meteor.Error(ERROR_CODE.UNAUTHORIZED);
    // validate startTime and endTime
    // IF isPresent is true, just check startTime < now
    // ELSE startTime < endTime and endTime < now 
    if (isPresent) {
      if (startTime && startTime.getTime() > Date.now()) {
        throw new ValidationError([{
          name: 'startTime',
          type: 'ORGANIZATION_INVALID_DATE_TIME',
          reason: 'Start time should less than now'
        }]);
      }
    } else {
      if (!startTime || !endTime) {
        throw new Meteor.Error('INVALID_PARAMETER', 'Start time or end time invalid');
      } else {
        if (startTime.getTime() >= endTime.getTime()) {
          throw new ValidationError([{
            name: 'endTime',
            type: 'ORGANIZATION_INVALID_RANGE',
            reason: 'End time should greater than start time'
          }]);
        } else if (endTime.getTime() > Date.now()) {
          throw new ValidationError([{
            name: 'endTime',
            type: 'ORGANIZATION_INVALID_RANGE',
            reason: 'End time should less than now'
          }]);
        }
      }
    }

    if (!this.isSimulation) {
      var result = Organizations.insert({
        name,
        jobTitle,
        description,
        imageUrl,
        startTime,
        endTime,
        isPresent
      });
      return result;
    }
  }
});

// Edit Organization's name, description, imageUrl, address
export const update = new ValidatedMethod({
  name: 'organizations.update',
  validate: validate.methodValidator({
    ...constraints,
    _id: {
      type: 'string',
      presence: true
    }
  }),
  run({ _id, name, jobTitle, description, imageUrl, startTime, endTime, isPresent }) {
    if (!Meteor.userId())
      throw new Meteor.Error(ERROR_CODE.UNAUTHORIZED);

    if (isPresent) {
      if (startTime && startTime.getTime() > Date.now()) {
        throw new ValidationError([{
          name: 'startTime',
          type: 'ORGANIZATION_INVALID_DATE_TIME',
          reason: 'Start time should less than now'
        }]);
      }
    } else {
      if (!startTime || !endTime) {
        throw new Meteor.Error('INVALID_PARAMETER', 'Start time or end time invalid');
      } else {
        if (startTime.getTime() >= endTime.getTime()) {
          throw new ValidationError([{
            name: 'endTime',
            type: 'ORGANIZATION_INVALID_RANGE',
            reason: 'End time should greater than start time'
          }]);
        } else if (endTime.getTime() > Date.now()) {
          throw new ValidationError([{
            name: 'endTime',
            type: 'ORGANIZATION_INVALID_RANGE',
            reason: 'End time should less than now'
          }]);
        }
      }
    }

    if (!this.isSimulation) {
      var selector = { _id: _id };
      var modifier = {
        $set: {
          name,
          jobTitle,
          description,
          startTime,
          endTime,
          isPresent,
          imageUrl
        }
      };

      var org = Organizations.findOne({ _id: _id });

      if (!org) {
        throw new Meteor.Error(404, 'Organization not found');
      } else if (org.leaderId != Meteor.userId()) {
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
      } else if (org.leaderId != Meteor.userId()) {
        throw new Meteor.Error(ERROR_CODE.PERMISSION_DENIED, 'Permission Denied');
      } else {
        return Organizations.remove(selector);
      }
    }
  }
});

export const details = new ValidatedMethod({
  name: 'organizations.details',
  validate: validate.methodValidator({
    _id: {
      type: 'string',
      presence: true,
    }
  }),
  run({ _id }) {
    if (!Meteor.userId()) {
      throw new Meteor.Error(ERROR_CODE.UNAUTHORIZED);
    }
    const org = Organizations.findOne(_id);
    if (!org) {

    } else {
      if (org.leaderId != Meteor.userId()) {
        throw new Meteor.Error(ERROR_CODE.PERMISSION_DENIED);
      } else {
        return org;
      }
    }
  }
});

/**
 * Method to add employee into organization
 *
 * @param { string } organizationId (required)
 * @param { string } email (required)
 * @param { string } firstName (required)
 * @param { string } lastName
 *
 * @return { string| bool }
 */
export const addEmployee = new ValidatedMethod({
  name: 'organizations.addEmployee',
  mixins: [MethodValidatorMixin, UserLoggedInMixin],
  rules: {
    organizationId: {
      type: 'string',
      presence: true,
      exists: {
        collection: 'Organizations',
        extraSelector() {
          return {
            leaderId: Meteor.userId()
          }
        }
      }
    },
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
  },
  run({ organizationId, firstName, lastName, email }) {
    if (!this.isSimulation) {
      let leaderId = Meteor.userId();
      let employeeId;

      const org = Organizations.findOne(organizationId);
      const employee = Employees.findOne({ email, organizationId, leaderId });
      if (employee) {
        throw new ValidationError([{
          name: 'email',
          type: 'exists',
          reason: 'This employee already exists'
        }]);
      } else {
        return Employees.insert({ leaderId, organizationId, firstName, lastName, email });
      }
    }
  }
});

/**
 * Method to add employee into organization
 *
 * @param { string } organizationId (required)
 * @param { string } email (required)
 * @param { string } firstName (required)
 * @param { string } lastName
 *
 * @return { string| bool }
 */
export const importEmployees = new ValidatedMethod({
  name: 'organizations.importEmployees',
  mixins: [MethodValidatorMixin, UserLoggedInMixin],
  rules: {
    organizationId: {
      type: 'string',
      presence: true,
      exists: {
        collection: 'Organizations',
        extraSelector() {
          return {
            leaderId: Meteor.userId()
          }
        }
      }
    },
    employees: {
      presence: true,
      type: 'array'
    }
  },
  run({ organizationId, employees }) {
    if (!this.isSimulation) {
      let leaderId = Meteor.userId();
      _.each(employees, e => {
        const { firstName, lastName, email } = e;
        const employee = Employees.findOne({ email, organizationId, leaderId });
        if (!employee) {
          return Employees.insert({ leaderId, organizationId, firstName, lastName, email });
        }
      });
    }
  }
});


/**
 * Method to update employee single field
 *
 * If field is firstName, rule is string, required
 *          is lastName, rule is string
 *          is email, rule is string, valid email address, required
 *
 * @param { string } employeeId must exists and you must be owner
 * @param { string } field is employee's field name. firstName|lastName|email
 * @param { any } value is data of that field need to update
 */
export const updateEmployeeSingleField = new ValidatedMethod({
  name: 'employees.updateSingleField',
  mixins: [MethodValidatorMixin, UserLoggedInMixin],
  rules: {
    organizationId: {
      type: 'string',
      exists: {
        collection: 'Organizations',
        extraSelector() {
          return {
            leaderId: Meteor.userId()
          };
        }
      }
    },
    employeeId: {
      type: 'string',
      exists: {
        collection: 'Employees',
        extraSelector() {
          return {
            leaderId: Meteor.userId()
          };
        }
      }
    },
    field: {
      presence: true,
      type: 'string',
      inclusion: ['firstName', 'lastName', 'email'],
    },
    value: {

    }
  },
  run({ organizationId, employeeId, field, value }) {
    let rule;
    switch (field) {
      case 'firstName':
        rule = {
          presence: true,
          type: 'string'
        };
        break;

      case 'lastName':
        rule = {
          type: 'string'
        };
        break;

      case 'email':
        rule = {
          presence: true,
          email: true,
        };
        break;
    }

    const error = validate.execute({
      [field]: value
    }, {
      [field]: rule
    });
    if (error) throw new ValidationError(error);

    if (!this.isSimulation) {
      const leaderId = Meteor.userId();

      if (field == 'email') {
        let employee = Employees.findOne({ email: value, leaderId, organizationId });
        if (employee && employee._id != employeeId) {
          throw new ValidationError([{
            name: 'email',
            type: 'INVALID_PARAMETER',
            reason: 'Email address already in use!'
          }]);
        }
      }
      return Employees.update({ _id: employeeId }, {
        $set: {
          [field]: value
        }
      });
    }
  }
});

export const toggleStatusEmployee = new ValidatedMethod({
  name: 'employees.toggleStatus',
  mixins: [MethodValidatorMixin, UserLoggedInMixin],
  rules: {
    employeeId: {
      presence: true,
      type: 'string',
      exists: {
        collection: 'Employees',
        extraSelector() {
          return {
            leaderId: Meteor.userId()
          };
        }
      }
    },
    status: {
      presence: true,
      type: 'string',
      inclusion: [STATUS_ACTIVE, STATUS_DEACTIVE]
    }
  },
  run({ employeeId, status }) {
    return Employees.update({ _id: employeeId }, { $set: { status: status } });
  }
});

export const removeEmployee = new ValidatedMethod({
  name: 'organization.removeEmployee',
  mixins: [MethodValidatorMixin, UserLoggedInMixin],
  rules: {
    employeeId: {
      presence: true,
      type: 'string',
      exists: {
        collection: 'Employees',
        extraSelector() {
          return {
            leaderId: Meteor.userId()
          };
        }
      }
    }
  },
  run({ employeeId }) {
    return Employees.remove({ _id: employeeId });
  }
});

/**
 * Method get present organizations
 * @return {Array} list of present organizationId ordered by the latest startTime
 */
export const getPresentOrganizations = new ValidatedMethod({
  name: "organization.getPresentOrganizations",
  validate: null,
  run({leaderId, isPresent}) {
    const
      query = {leaderId, isPresent, status: "ACTIVE"},
      projection = {name: 1, jobTitle: 1, description: 1}
      ;

    return Organizations.find(query, {projection}).fetch();
  }
});
