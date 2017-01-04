import {Aliases} from './index';

export const isAliasInBlacklist = ({alias}) => {
  return Aliases.find({alias}).count() > 0 ? true : false;
}