import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import _ from 'lodash';

// collections
import {Profiles, STATUS_ACTIVE, STATUS_INACTIVE} from './index';
import {Organizations} from '/imports/api/organizations/index';
import {Employees} from '/imports/api/employees/index';
import {Industries} from '/imports/api/industries/index';
import {Configs} from '/imports/api/users/index';

import {IDValidator} from '/imports/utils';

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
        let result = {
          profile: {
            name: null,
            orgName: null,
            industry: null,
            phoneNumber: null,
            aboutMe: null,
            picture: null,
            noOrg: null,
            noEmployees: null,
            noFeedbacks: null
          }
        };

        // Always public the name
        const profile = Profiles.findOne({userId: user._id});
        if (!!profile.firstName || profile.lastName) {
          result.profile.name = `${profile.firstName} ${profile.lastName}`;
        }
        if(Configs.find({userId: user._id}).count() > 0) {
          const configs = Configs.find({userId: user._id}).fetch()[0].configs;
          // Get public information
          // Profile
          const profileConfigs = configs.profile;
          // orgName
          if(profileConfigs.orgName && typeof profileConfigs.orgName !== 'undefined') {
            if (Organizations.find({owner: user._id}).count() > 0) {
              const orgName = Organizations.find({owner: user._id}, {"sort": ['endTime', 'desc']}).fetch()[0].name;
              result.profile.orgName = !!orgName ? orgName : null;
            }
          }
          // industry
          if(profileConfigs.industry && typeof profileConfigs.industry !== 'undefined') {
            if (!!profile.industries) {
              result.profile.industry = Industries.findOne({_id: {$in: profile.industries}}).name;
            }
          }
          // phoneNumber
          if(profileConfigs.phoneNumber && typeof profileConfigs.phoneNumber !== 'undefined') {
            result.profile.phoneNumber = !!profile.phoneNumber ? profile.phoneNumber : null;
          }
          // aboutMe
          if(profileConfigs.aboutMe && typeof profileConfigs.aboutMe !== 'undefined') {
            result.profile.aboutMe = !!profile.aboutMe ? profile.aboutMe : null;
          }
          // picture
          if(profileConfigs.picture && typeof profileConfigs.picture !== 'undefined') {
            result.profile.picture = !!profile.imageUrl ? profile.imageUrl : null;
          }
          // noOrg
          if(profileConfigs.noOrg && typeof profileConfigs.noOrg !== 'undefined') {
            const noOrg = Organizations.find({owner: user._id}).count();
            result.profile.noOrg = !!noOrg ? noOrg : null;
          }
          // noEmployees
          if(profileConfigs.noEmployees && typeof profileConfigs.noEmployees !== 'undefined') {
            result.profile.noEmployees = 149;
          }
          // noFeedbacks
          if(profileConfigs.noFeedbacks && typeof profileConfigs.noFeedbacks !== 'undefined') {
            result.profile.noFeedbacks = 240;
          }
        }
        return result;
      }
    }
  }
});


