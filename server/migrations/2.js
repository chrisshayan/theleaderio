var Intercom = require('intercom-client');
import { Profiles } from '/imports/api/profiles';
import { Organizations } from '/imports/api/organizations';
import { Employees } from '/imports/api/employees';
import { Industries } from '/imports/api/industries';


Migrations.add({
  version: 2,
  up: function() {
    //Create a client:
    var token = Meteor.settings.intercom.token;
    var client = new Intercom.Client({ token: token });

    var users = Meteor.users.find().fetch();

    _.each(users, user => {
      var intercomUser = {
        user_id: user._id,
        email: user.emails[0].address,
        name: '',
        signed_up_at: user.createdAt,
        custom_attributes: {
          username: user.username,
          profile: ['http://', user.username, '.theleader.io'].join('')
        }
      };

      // Profile
      var profile = Profiles.findOne({ userId: user._id });
      if (profile) {
        // append name
        intercomUser.name = [profile['firstName'], profile['lastName']].join(' ');
        // append avatar
        if (!_.isEmpty(profile['imageUrl'])) {
          intercomUser.avatar = {
            type: 'avatar',
            image_url: profile['imageUrl']
          };
        }
        // append job title
        if (!_.isEmpty(profile['title'])) {
          intercomUser.custom_attributes['job_title'] = profile['title'];
        }
        // append phone
        if (!_.isEmpty(profile['phoneNumber'])) {
          intercomUser.custom_attributes['phone'] = profile['phoneNumber'];
        }
      }

      // Organization count
      var organizationCount = Organizations.find({ leaderId: user._id }).count();
      intercomUser.custom_attributes['organization_count'] = organizationCount;
      // Organization last update
      var organizationLastUpdated = Organizations.find({ leaderId: user._id }, { sort: { createdAt: -1 }, limit: 1 }).fetch();
      if (organizationLastUpdated.length === 1) {
        intercomUser.custom_attributes['organization_latest'] = organizationLastUpdated[0].createdAt;
      }

      // Employees
      var employeeCount = Employees.find({ leaderId: user._id }).count();
      intercomUser.custom_attributes['employee_count'] = employeeCount;

      client.users.update(intercomUser);
    });
  }
});
