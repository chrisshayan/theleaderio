import Intercom from 'intercom-client';
import { Organizations } from '/imports/api/organizations';
import { Employees } from '/imports/api/employees';

const TOKEN = Meteor.settings.intercom.token;
export const client = new Intercom.Client({ token: TOKEN });


export function upsertUser(attrs = {}, customAttributes = {}) {
  if (_.isEmpty(attrs['user_id']) || _.isEmpty(attrs['email'])) return false;
  attrs['custom_attributes'] = customAttributes;
  client.users.update(attrs);
}

export function upsertOrganization(userId) {
  const orgCount = Organizations.find({ leaderId: userId }).count();
  let attrs = {
    user_id: userId,
    custom_attributes: {
      organization_count: orgCount,
      organization_latest: new Date()
    }
  };
  return upsertUser(attrs, customAttributes);
}

export function upsertEmployee(userId) {
  const employeeCount = Employees.find({ leaderId: userId }).count();
  let attrs = {
    user_id: userId,
    custom_attributes: {
      employee_count: employeeCount,
      employee_latest: new Date()
    }
  };
  return upsertUser(attrs, customAttributes);
}

export function addEvent(userId, name = '', meta = {}, cb) {
  client.events.create({
    event_name: name,
    created_at: new Date(),
    user_id: userId,
    metadata: meta
  }, cb);
}
