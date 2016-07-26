import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import { Accounts } from 'meteor/accounts-base';
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
  run({userId, firstName, lastName, industries, imageUrl, phoneNumber, aboutMe}) {
    const selector = {userId};
    const modifier = {};
    if (typeof firstName !== "undefined") {
      modifier['firstName'] = firstName;
    }
    if (typeof lastName !== "undefined") {
      modifier['lastName'] = lastName;
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
    }
  }).validator(),
  run({alias}) {
    if (!this.isSimulation) {
      const user = Accounts.findUserByUsername(alias);
      if (!_.isEmpty(user)) {
        if (Preferences.find({userId: user._id, name: 'publicInfo'}).count() == 0) {
          addPreferences.call({name: 'publicInfo', preferences: DEFAULT_PUBLIC_INFO_PREFERENCES});
        }
        let result = {
          basic: {
            name: null,
            title: null,
            industry: null
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
          const preferences = Preferences.find({userId: user._id}).fetch()[0].preferences;
          // Get preferences
          const {contact, summary, picture, about} = preferences;

          // Get contact info
          // phoneNumber
          if (contact.phone && typeof contact.phone !== 'undefined') {
            result.contact.phone = !!profile.phoneNumber ? profile.phoneNumber : null;
          }
          // email
          if(contact.email && typeof contact.email !== 'undefined') {
            result.contact.email = user.emails[0].address;
          }

          // Get summary info
          // noOrg
          if (preferences.summary.noOrg && typeof preferences.summary.noOrg !== 'undefined') {
            const noOrg = Organizations.find({owner: user._id}).count();
            result.summary.noOrg = !!noOrg ? noOrg : null;
          }
          // noEmployees
          if (preferences.summary.noEmployees && typeof preferences.summary.noEmployees !== 'undefined') {
            result.summary.noEmployees = 149;
          }
          // noFeedbacks
          if (preferences.summary.noFeedbacks && typeof preferences.summary.noFeedbacks !== 'undefined') {
            result.summary.noFeedbacks = 240;
          }

          // Get picture
          if (preferences.picture.imageUrl && typeof preferences.picture.imageUrl !== 'undefined') {
            result.picture.imageUrl = !!profile.imageUrl ? profile.imageUrl : null;
          }

          // Get about info
          // AboutMe
          if (preferences.about.aboutMe && typeof preferences.about.aboutMe !== 'undefined') {
            result.about.aboutMe = !!profile.aboutMe ? profile.aboutMe : null;
          }
          
          // orgName
          // if (preferences.summary.orgName && typeof preferences.summary.orgName !== 'undefined') {
          //   if (Organizations.find({owner: user._id}).count() > 0) {
          //     const orgName = Organizations.find({owner: user._id}, {"sort": ['endTime', 'desc']}).fetch()[0].name;
          //     result.summary.orgName = !!orgName ? orgName : null;
          //   }
          // }
          
        }
        return result;
      }
    }
  }
});


