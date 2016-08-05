import { Meteor } from 'meteor/meteor';
import { UNAUTHORIZED } from '../error_code';
/**
 * Mixin to required user must logged in
 */
export default function(methodOptions) {
  const runFunc = methodOptions.run;
  methodOptions.run = function() {
    if (!Meteor.userId()) {
      throw new Meteor.Error(UNAUTHORIZED, 'You need to login');
    };
    return runFunc.call(this, ...arguments);
  }
  return methodOptions;
}
