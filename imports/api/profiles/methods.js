import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import _ from 'lodash';

import { Profiles, STATUS_ACTIVE, STATUS_INACTIVE } from './index';
import { IDValidator } from '/imports/utils';

/**
 * CUD user profiles (Create, Update, Deactivate)
 * Methods:
 * # create
 * # edit
 * # editIndustries
 * # setStatus
 */
// Create User Profile
// with basics information: userId, firstName, lastName
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
  run(userProfile) {
    return Profiles.insert(userProfile);
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
    }
  }).validator(),
  run({ userId, firstName, lastName, imageUrl, phoneNumber }) {
    var selector = { userId };
    var modifier = {};
    if(firstName != undefined) {
      modifier['firstName'] = firstName;
    }
    if(lastName != undefined) {
      modifier['lastName'] = lastName;
    }
    if(industries != undefined) {
      modifier['industries'] = industries;
    }
    if(imageUrl != undefined) {
      modifier['imageUrl'] = imageUrl;
    }
    if(phoneNumber != undefined) {
      modifier['phoneNumber'] = phoneNumber;
    }
    var userProfile = Profiles.findOne(selector);
    if(!userProfile) {
      throw new Meteor.Error(404, 'User not found');
    } else if(!_.isEmpty(modifier)) {
      return Profiles.update(selector, { $set: { modifier }});
    } else {
      return true;
    }
  }
});

// Add Industry
export const addIndustry = new ValidatedMethod({
  name: 'profiles.addIndustry',
  validate: new SimpleSchema({
    userId: {
      type: String
    }, // validate userId which is mapped with _id in collection Accounts
    industries: {
      type: String
    }
  }).validator(),
  run({ userId, industry }) {
    var userProfile = Profiles.findOne({ userId });
    if(!userProfile) {
      throw new Meteor.Error(404, 'User not found');
    } else {
      return Profiles.update({ userId }, {
        $push: { industries: industry }});
    }
  }
});

// Remove Industry
export const removeIndustry = new ValidatedMethod({
  name: 'profiles.removeIndustry',
  validate: new SimpleSchema({
    userId: {
      type: String
    }, // validate userId which is mapped with _id in collection Accounts
    industries: {
      type: String
    }
  }).validator(),
  run({ userId, industry }) {
    var userProfile = Profiles.findOne({ userId });
    if(!userProfile) {
      throw new Meteor.Error(404, 'User not found');
    } else {
      return Profiles.update({ userId }, {
        $pull: { industries: industry }});
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
  run({ userId, address }) {
    var userProfile = Profiles.findOne({ userId });
    if(!userProfile) {
      throw new Meteor.Error(404, 'User not found');
    } else {
      return Profiles.update({ userId: userProfile.userId }, {
        $set: { address: userProfile.address }});
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
      allowedValues: [  STATUS_ACTIVE, STATUS_INACTIVE ]
    }
  }).validator(),
  run({userId, status}) {
    var userProfile = Profiles.findOne({ userId });
    if(!userProfile) {
      throw new Meteor.Error(404, 'User not found');
    } else {
      return Profiles.update({ userId }, { $set: { status }});
    }
  }
});
