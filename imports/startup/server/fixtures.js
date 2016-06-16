import { name, internet, image } from 'faker';
import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Profiles } from '/imports/api/profiles';
import * as Actions from '/imports/api/profiles/methods';

Meteor.startup(() => {

  const docsNumber = Profiles.find({}).count();
  console.log(docsNumber);
  // if(!docsNumber) {
    _.times(1, () => {
      const userProfile = {
        userId: internet.userName(),
        alias: internet.userName(),
        firstName: name.firstName(),
        lastName: name.lastName(),
        industries: [],
        status: "",
        imageUrl: image.imageUrl()
      }
      Actions.insert.call(userProfile);
      // Meteor.call('userprofiles.remove', userProfile.userId);
    });
  // }
});
