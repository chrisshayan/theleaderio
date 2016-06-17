import { Meteor } from 'meteor/meteor';

import { profilesTest } from '/imports/api/profiles/profiles_test';
import { organizationsTest } from '/imports/api/organizations/organizations_test';
import { employeesTest } from '/imports/api/employees/employees_test';

Meteor.startup(() => {
  // Profiles: Fixtures / Tests
  profilesTest();


  // Organizations: Fixtures / Tests
  organizationsTest();

  // Employees: Fixtures / Tests
  employeesTest();
});
