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
  if(options.message) return validate.format('^' + options.message);
  return `must be ${options.type}.`;
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

export default validate;