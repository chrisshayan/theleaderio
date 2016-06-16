import { Meteor,  } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Profiles, STATUS_ACTIVE, STATUS_DEACTIVE } from './index';
import { IDValidator } from '/imports/utils';

/**
 * CUD user profiles (Create, Update, Deactivate)
 */
// User validator
export const userValidator = new ValidatedMethod({
  name: 'profile.userValidator',
  validate: new SimpleSchema({
    // Should be ...IDValidator in real data
    userId: {
      type: String
    }
  }).validator(),
  run(userId) {
    const docsNumber = Profiles.find({ userId: userId }).count();
    if(!docsNumber) {
      throw new Meteor.Error(400, 'Invalid User');
    }
  }
});

// Create
export const insert = new ValidatedMethod({
  name: 'profiles.insert',
  validate: new SimpleSchema({
    userId: {
      type: String
    },
    alias: {
      type: String
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    industries: {
      type: [String]
    },
    status: {
      type: String,
      allowedValues: [ STATUS_ACTIVE, STATUS_DEACTIVE ]
    },
    imageUrl: {
      type: String
    }
  }).validator(),
  run(userProfile) {
    return Profiles.insert(userProfile);
  }
});

// Update Name
export const updateName = new ValidatedMethod({
  name: 'profiles.updateName',
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
    const docsNumber = Profiles.find({ userId: userProfile.userId }).count();
    if(!docsNumber) {
      throw new Meteor.Error(400, 'Invalid User');
    }
    else {
      return Profiles.update({ userId: userProfile.userId }, {
        $set: { firstName: userProfile.firstName, lastName: userProfile.lastName
      }});
    }
  }
});

// Update Status
export const updateStatus = new ValidatedMethod({
  name: 'profiles.updateStatus',
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
    const docsNumber = Profiles.find({ userId: userProfile.userId }).count();
    if(!docsNumber) {
      throw new Meteor.Error(400, 'Invalid User');
    }
    else {
      return Profiles.update({ userId: userProfile.userId }, { $set: { 
        status: userProfile.status
      }});
    }
  }
});