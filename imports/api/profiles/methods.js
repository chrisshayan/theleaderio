import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Profiles, STATUS_ACTIVE, STATUS_DEACTIVE } from './index';
import { IDValidator } from '/imports/utils';

/**
 * CUD user profiles (Create, Update, Deactivate)
 * Methods:
 * # validateUser
 * # createProfile
 * # editName
 * # editIndustries
 * # editAddress
 * # editImageUrl
 * # editStatus
 */
// validate user
export const validateUser = new ValidatedMethod({
  name: 'profile.validateUser',
  validate: new SimpleSchema({
    // Should be ...IDValidator in real data
    userId: {
      type: String
    }
  }).validator(),
  run(userProfile) {
    const docsNumber = Profiles.find({ userId: userProfile.userId }).count();
    if(!docsNumber) {
      return 0; // Invalid User
    } else {
      return 1; // Valid User
    }
  }
});

// Create User Profile
// with basics information: userId, alias, status
export const createProfile = new ValidatedMethod({
  name: 'profiles.createProfile',
  validate: new SimpleSchema({
    userId: {
      type: String
    },
    alias: {
      type: String
    },
    status: {
      type: String,
      allowedValues: [ STATUS_ACTIVE, STATUS_DEACTIVE ]
    }
  }).validator(),
  run(userProfile) {
    return Profiles.insert(userProfile);
  }
});

// Update Name
export const editName = new ValidatedMethod({
  name: 'profiles.editName',
  validate: new SimpleSchema({
    userId: {
      type: String
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    }
  }).validator(),
  run(userProfile) {
    if(!validateUser.call({userId: userProfile.userId})) {
      throw new Meteor.Error(400, 'Invalid User');
    } else {
      return Profiles.update({ userId: userProfile.userId }, {
        $set: { firstName: userProfile.firstName, lastName: userProfile.lastName
      }});
    }
  }
});

// Update Industries
export const editIndustries = new ValidatedMethod({
  name: 'profiles.editIndustries',
  validate: new SimpleSchema({
    userId: {
      type: String
    },
    industries: {
      type: [String],
      optional: true
    }
  }).validator(),
  run(userProfile) {
    if(!validateUser.call({userId: userProfile.userId})) {
      throw new Meteor.Error(400, 'Invalid User');
    } else {
      return Profiles.update({ userId: userProfile.userId }, {
        $set: { industries: userProfile.industries }});
    }
  }
});

// Update address
export const editAddress = new ValidatedMethod({
  name: 'profiles.editAddress',
  validate: new SimpleSchema({
    userId: {
      type: String
    },
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
  run(userProfile) {
    if(!validateUser.call({userId: userProfile.userId})) {
      throw new Meteor.Error(400, 'Invalid User');
    } else {
      return Profiles.update({ userId: userProfile.userId }, {
        $set: { address: userProfile.address }});
    }
  }
});

// Update imageUrl
export const editImageUrl = new ValidatedMethod({
  name: 'profiles.editImageUrl',
  validate: new SimpleSchema({
    userId: {
      type: String
    },
    imageUrl: {
      type: String
    }
  }).validator(),
  run(userProfile) {
    if(!validateUser.call({userId: userProfile.userId})) {
      throw new Meteor.Error(400, 'Invalid User');
    } else {
      return Profiles.update({ userId: userProfile.userId }, {
        $set: { imageUrl: userProfile.imageUrl }});
    }
  }
});

// Update Status (Deactivate)
export const editStatus = new ValidatedMethod({
  name: 'profiles.editStatus',
  validate: new SimpleSchema({
    userId: {
      type: String
    },
    status: {
      type: String,
      allowedValues: [  STATUS_ACTIVE, STATUS_DEACTIVE ]
    }
  }).validator(),
  run(userProfile) {
    if(!validateUser.call({userId: userProfile.userId})) {
      throw new Meteor.Error(400, 'Invalid User');
    } else {
      return Profiles.update({ userId: userProfile.userId }, { $set: {
        status: userProfile.status
      }});
    }
  }
});
