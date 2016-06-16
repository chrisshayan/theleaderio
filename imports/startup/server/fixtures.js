import { name, internet, image } from 'faker';
import _ from 'lodash';
import { Meteor } from 'meteor/meteor';

import { STATUS_ACTIVE, STATUS_DEACTIVE, Profiles } from '/imports/api/profiles';
import * as Actions from '/imports/api/profiles/methods';

Meteor.startup(() => {
  /**
   * Fake data for user profiles
   */
  const docsNumber = Profiles.find({}).count();
  if(!docsNumber) {
    _.times(200, () => {
      const userProfile = {
        userId: internet.userName(),
        alias: internet.userName(),
        firstName: name.firstName(),
        lastName: name.lastName(),
        industries: [],
        status: STATUS_ACTIVE,
        imageUrl: image.imageUrl()
      }
      Actions.insert.call(userProfile);
    });
  }
});

Meteor.startup(() => {
  // Testing for update method of user profile
  console.log('Test - Method Update Profile Name');
  userProfile = {
    userId: 'Herminio53',
    firstName: 'Tan',
    lastName: 'Khuu'
  };
  Actions.updateName.call(userProfile, (error) => {
    if(error)
      console.log('Fail: ' + error);
    else
      console.log('Pass');
  });

  // Testing for update method of user profile
  console.log('Test - Method Update Profile Status');
  userProfile = {
    userId: 'Herminio53',
    status: STATUS_DEACTIVE
  };
  Actions.updateStatus.call(userProfile, (error) => {
    if(error)
      console.log('Fail: ' + error);
    else
      console.log('Pass');
  });
});
