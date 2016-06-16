import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import Profiles from './index';

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
      type: String
    },
    imageUrl: {
      type: String
    }
  }).validator(),
  run(userProfile) {
    // console.log(userProfile);
    return Profiles.insert(userProfile);
  }

});
