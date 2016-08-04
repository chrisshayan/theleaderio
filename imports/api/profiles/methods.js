import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {Accounts} from 'meteor/accounts-base';
import _ from 'lodash';

// collections
import {Profiles, STATUS_ACTIVE, STATUS_INACTIVE} from './index';
import {Organizations} from '/imports/api/organizations/index';
import {Employees} from '/imports/api/employees/index';
import {Industries} from '/imports/api/industries/index';
import {Preferences} from '/imports/api/users/index';

import {IDValidator} from '/imports/utils';
import {DEFAULT_PUBLIC_INFO_PREFERENCES} from '/imports/utils/default_user_preferences';

// methods
import {addPreferences} from '/imports/api/users/methods';

/**
 * CUD user profiles (Create, Update, Deactivate)
 * Methods:
 * # create
 * # edit
 * # editIndustries
 * # setStatus
 */
// Create User Profile
// with basics information: userId, firstName, lastName, publicFields
export const create = new ValidatedMethod({
  name: 'profiles.create',
  validate: new SimpleSchema({
    userId: {
      type: String
    }, // validate userId which is mapped with _id in collection Accounts
    firstName: {
      type: String
    },
    lastName: {
      type: String,
      optional: true
    }
  }).validator(),
  run({userId, firstName, lastName}) {
    // console.log({userId, firstName, lastName});
    return Profiles.insert({userId, firstName, lastName});
  }
});

// Edit User Profile's Inforamtion
export const edit = new ValidatedMethod({
  name: 'profiles.edit',
  validate: new SimpleSchema({
    userId: {
      type: String
    }, // validate userId which is mapped with _id in collection Accounts
    firstName: {
      type: String,
      optional: true
    },
    lastName: {
      type: String,
      optional: true
    },
    title: {
      type: String,
      optional: true
    },
    industries: {
      type: [String],
      optional: true
    },
    imageUrl: {
      type: String,
      optional: true
    },
    phoneNumber: {
      type: String,
      optional: true
    },
    aboutMe: {
      type: String,
      optional: true
    }
  }).validator(),
  run({userId, firstName, lastName, title, industries, imageUrl, phoneNumber, aboutMe}) {
    const selector = {userId};
    const modifier = {};
    if (typeof firstName !== "undefined") {
      modifier['firstName'] = firstName;
    }
    if (typeof lastName !== "undefined") {
      modifier['lastName'] = lastName;
    }
    if (typeof title !== "undefined") {
      modifier['title'] = title;
    }
    if (typeof industries !== "undefined") {
      modifier['industries'] = industries;
    }
    if (typeof imageUrl !== "undefined") {
      modifier['imageUrl'] = imageUrl;
    }
    if (typeof phoneNumber !== "undefined") {
      modifier['phoneNumber'] = phoneNumber;
    }
    if (typeof aboutMe !== "undefined") {
      modifier['aboutMe'] = aboutMe;
    }
    const userProfile = Profiles.findOne(selector);
    if (!userProfile) {
      throw new Meteor.Error(404, 'User not found');
    } else if (!_.isEmpty(modifier)) {
      return Profiles.update(selector, {$set: modifier});
    } else {
      return true;
    }
  }
});

// Edit address
export const editAddress = new ValidatedMethod({
  name: 'profiles.editAddress',
  validate: new SimpleSchema({
    ...IDValidator, // validate userId which is mapped with _id in collection Accounts
    "address.zipCode": {
      type: String,
      optional: true
    },
    "address.countryCode": {
      type: String,
      optional: true
    },
    "address.country": {
      type: String,
      optional: true
    },
    "address.city": {
      type: String,
      optional: true
    },
    "address.district": {
      type: String,
      optional: true
    },
    "address.streetName": {
      type: String,
      optional: true
    },
    "address.streetAddress": {
      type: String,
      optional: true
    },
    "address.secondaryAddress": {
      type: String,
      optional: true
    },
    "address.geo.latitude": {
      type: String,
      optional: true
    },
    "address.geo.longitude": {
      type: String,
      optional: true
    }
  }).validator(),
  run({userId, address}) {
    var userProfile = Profiles.findOne({userId});
    if (!userProfile) {
      throw new Meteor.Error(404, 'User not found');
    } else {
      return Profiles.update({userId: userProfile.userId}, {
        $set: {address: userProfile.address}
      });
    }
  }
});

// Set Status (Activate / Deactivate)
export const setStatus = new ValidatedMethod({
  name: 'profiles.setStatus',
  validate: new SimpleSchema({
    userId: {
      type: String
    }, // validate userId which is mapped with _id in collection Accounts
    status: {
      type: String,
      allowedValues: [STATUS_ACTIVE, STATUS_INACTIVE]
    }
  }).validator(),
  run({userId, status}) {
    const userProfile = Profiles.findOne({userId});
    if (!userProfile) {
      throw new Meteor.Error(404, 'User not found');
    } else {
      return Profiles.update({userId}, {$set: {status}});
    }
  }
});

// get public information
export const getPublicData = new ValidatedMethod({
  name: 'profiles.getPublicData',
  validate: new SimpleSchema({
    alias: {
      type: String
    },
    isGetAll: {
      type: Boolean
    }
  }).validator(),
  run({alias, isGetAll}) {
    if (!this.isSimulation) {
      const user = Accounts.findUserByUsername(alias);
      if (!_.isEmpty(user)) {
        if (Preferences.find({userId: user._id, name: 'publicInfo'}).count() == 0) {
          addPreferences.call({name: 'publicInfo', preferences: DEFAULT_PUBLIC_INFO_PREFERENCES});
        }
        let result = {
          basic: {
            name: null,
            industry: null
          },
          headline: {
            title: null
          },
          contact: {
            phone: null,
            email: null
          },
          summary: {
            noOrg: null,
            noEmployees: null,
            noFeedbacks: null
          },
          picture: {
            imageUrl: null
          },
          about: {
            aboutMe: null
          },
          organizations: [],
          chart: {
            label: [],
            overall: [],
            purpose: [],
            mettings: [],
            rules: [],
            communications: [],
            leadership: [],
            workload: [],
            energy: [],
            stress: [],
            decision: [],
            respect: [],
            conflict: []
          },
          metrics: {
            overall: null,
            purpose: null,
            mettings: null,
            rules: null,
            communications: null,
            leadership: null,
            workload: null,
            energy: null,
            stress: null,
            decision: null,
            respect: null,
            conflict: null
          },
          preferences: {}
        };

        // Get basic info - always show
        // name
        const profile = Profiles.findOne({userId: user._id});
        if (!!profile.firstName || !!profile.lastName) {
          result.basic.name = `${profile.firstName} ${profile.lastName}`;
        }
        // industry
        if (!!profile.industries) {
          result.basic.industry = Industries.findOne({_id: {$in: profile.industries}}).name;
        }

        // others
        if (Preferences.find({userId: user._id}).count() > 0) {
          let preferences = {};
          if(isGetAll) {
            preferences = DEFAULT_PUBLIC_INFO_PREFERENCES;
          } else {
            preferences = Preferences.find({userId: user._id}).fetch()[0].preferences;
            result.preferences = preferences;
          }
          // Get preferences
          const {headline, contact, summary, picture, about, organizations} = preferences;

          // Get headline info
          // title
          if (headline.title && typeof headline.title !== 'undefined') {
            result.headline.title = !!profile.title ? profile.title : null;
          }

          // Get contact info
          // phoneNumber
          if (contact.phone && typeof contact.phone !== 'undefined') {
            result.contact.phone = !!profile.phoneNumber ? profile.phoneNumber : null;
          }
          // email
          if (contact.email && typeof contact.email !== 'undefined') {
            result.contact.email = user.emails[0].address;
          }

          // Get summary info
          // noOrg
          if (summary.noOrg && typeof summary.noOrg !== 'undefined') {
            const noOrg = Organizations.find({owner: user._id}).count();
            result.summary.noOrg = !!noOrg ? noOrg : null;
          }
          // noEmployees
          if (summary.noEmployees && typeof summary.noEmployees !== 'undefined') {
            result.summary.noEmployees = 149;
          }
          // noFeedbacks
          if (summary.noFeedbacks && typeof summary.noFeedbacks !== 'undefined') {
            result.summary.noFeedbacks = 240;
          }

          // Get picture
          if (picture.imageUrl && typeof picture.imageUrl !== 'undefined') {
            result.picture.imageUrl = !!profile.imageUrl ? profile.imageUrl : null;
          }

          // Get about info
          // AboutMe
          if (about.aboutMe && typeof about.aboutMe !== 'undefined') {
            result.about.aboutMe = !!profile.aboutMe ? profile.aboutMe : null;
          }

          // Get Organizations
          if (organizations.show) {
            if (Organizations.find({owner: user._id}).count() > 0) {
              const modifier = {
                fields: {name: true, startTime: true, endTime: true, isPresent: true, employees: true},
                sort: {startTime: -1}
              };
              const orgInfo = Organizations.find({owner: user._id}, modifier).fetch();
              result.organizations = !_.isEmpty(orgInfo) ? orgInfo : [];
            }
          }
          
          // Get chart info
          result.chart.label = ["February", "March", "April", "May", "June", "July"];
          result.chart.overall = [3.2, 4.0, 3.9, 4.9, 4.5, 4];
          result.chart.purpose = [2.2, 3.0, 4.9, 3.9, 5, 3];
          result.chart.mettings = [3.2, 3.0, 3.9, 4.9, 4, 4.3];
          result.chart.rules = [2.7, 4.6, 3.9, 3.2, 4, 3];
          result.chart.communications = [4.2, 2.0, 3.9, 4.9, 4, 4];
          result.chart.leadership = [3.2, 4.0, 3.9, 4.9, 4, 4];
          result.chart.workload = [3.2, 2.0, 3.9, 4.9, 2.3, 3];
          result.chart.energy = [2.7, 3.3, 4.6, 3.7, 4.5, 3.6];
          result.chart.stress = [3.3, 3.5, 4.2, 4.9, 5, 4];
          result.chart.decision = [2.6, 3.8, 4.2, 3.4, 3.4, 3.7];
          result.chart.respect = [4.2, 5.0, 3.9, 2.9, 4.5, 4];
          result.chart.conflict = [2.8, 2.0, 4.9, 4.9, 4.7, 4.4];

          // Get metrics
          const userId = user._id;
          // modifier for finding public metrics
          const metricsModifier = {
            fields: preferences.metrics
          };
          result.metrics = {
            overall: 4.4,
              purpose: 3.6,
              mettings: 4.7,
              rules: 5,
              communications: 4.2,
              leadership: 3.9,
              workload: 2.5,
              energy: 3.8,
              stress: 3.7,
              decision: 4.2,
              respect: 4,
              conflict: 4.9
          };
        }
        // console.log(result)
        return result;
      }
    }
  }
});


