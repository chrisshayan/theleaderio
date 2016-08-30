
// collections
import {Measures} from './index';

/**
 * @summary this function used to insert/update the measure data which collect data for measurement
 * @param doc
 */
export const measure = ({data}) => {
  const {leaderId, organizationId, type, interval, year, month, day, key, value} = data;
  let
    query = {},
    update = {},
    options = {}
  ;

  switch (type) {
    case "metric": {
      query = {leaderId, organizationId, type, interval, year, month, key};
      update = {$set: {value}};
      options = {upsert: true};
      break;
    }
    case "feedback": {

      break;
    }
    default: {
      return `unknown type: ${type}`;
    }
  }

  return Measures.update(query, update, options);
};