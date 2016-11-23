import {Roles} from 'meteor/alanning:roles';

// functions
import {aliasValidator} from '/imports/utils/index';

/**
 * Function format characters for alias
 * @param rawKeyword
 * @return {*}
 */
export const formatAlias = (rawAlias) => {
  let alias = "";
  for(let i = 0, max = rawAlias.length; i < max; i++) {
    if(aliasValidator(rawAlias[i])) {
      alias += rawAlias[i].toLowerCase();
    }
  }
  return alias;
};

export const isInactiveUser = ({userId}) => {
  return Roles.userIsInRole(userId, "inactive");
}
