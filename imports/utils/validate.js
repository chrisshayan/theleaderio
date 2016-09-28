import { ValidationError } from 'meteor/mdg:validation-error';
import validate from 'validate.js';

function isTypeValid(type, value) {
  switch (type) {
    case 'string':
      return _.isString(value);
    case 'number':
      return _.isNumber(value);
    case 'date':
      return _.isDate(value);
    case 'bool':
    case 'boolean':
      return _.isBoolean(value);
    case 'array':
      return _.isArray(value);
    case 'object':
      return _.isObject(value);
  }
  return true;
}

function getCollection(name) {
  if (_.isEmpty(name)) return null;
  switch (name.toLowerCase()) {
    case 'organizations':
      return require('/imports/api/organizations').Organizations;
    case 'employees':
      return require('/imports/api/employees').Employees;
    case 'leaders':
    case 'users':
      return require('/imports/api/users').Users;
  }
}

validate.validators.type = function(value, options, key, attributes) {
  if (!options || _.isEmpty(value) || !options.type) return undefined;
  options.type = options.type.toLowerCase();
  let isValid = isTypeValid(options.type, value);
  if (isValid && options.type == 'array' && options.nested) {
    _.each(value, val => {
      isValid &= isTypeValid(options.nested, val);
    });
  }
  if (isValid) return undefined;
  if (options.message) return validate.format('^' + options.message);
  return `must be ${options.type}.`;
};

validate.validators.exists = function(value, options, key, attributes) {
  if (Meteor.isServer) {
    if (options.collection && !_.isEmpty(value)) {
      const Collection = getCollection(options.collection);
      if (Collection) {
        let selector = { _id: value };
        if (_.isFunction(options.extraSelector)) {
          selector = {
            ...selector,
            ...options.extraSelector()
          };
        }
        const isExists = Collection.find(selector).count() > 0;
        if (!isExists) return 'does not exists';
      }
    }
  }
  return undefined;
};



validate.methodValidator = (constraints) => {
  return function(doc) {
    var raw = validate(doc, constraints);
    var error = [];
    _.each(raw, (msg, name) => {
      error.push({
        name,
        reason: msg[0],
        type: 'error'
      });
    });
    if (!_.isEmpty(error)) {
      throw new ValidationError(error);
    }
    return undefined;
  };
}

validate.execute = (doc, constraints) => {
  var raw = validate(doc, constraints);
  var error = [];
  _.each(raw, (msg, name) => {
    error.push({
      name,
      reason: msg[0],
      type: 'error'
    });
  });
  if (!_.isEmpty(error)) {
    return error;
  }
  return undefined;
}

/**
 * Mixin : Validator for method
 *
 * There are 2 parts:
 * + Validate data
 * + Clean data
 */
validate.methodMixin = function(options) {
  let { rules } = options;
  check(rules, Object);
  // create method validator
  options.validate = validate.methodValidator(rules);

  // clean data
  const runFunc = options.run;
  options.run = function() {
    if (_.isObject(arguments[0])) {
      const fields = _.keys(rules);
      arguments[0] = _.pick(arguments[0], ...fields);
    }
    return runFunc.call(this, ...arguments);
  }

  return options;
}

export default validate;
