import { name, internet, image } from 'faker';
import _ from 'lodash';
import { Meteor } from 'meteor/meteor';

import { STATUS_ACTIVE, STATUS_DEACTIVE, Profiles } from '/imports/api/profiles';
import * as Actions from '/imports/api/profiles/methods';


/**
 * Fixtures & Tests for Users Profiles
 */
 export const profilesTest = () => {
   // Create fake users
  const docsNumber = Profiles.find({}).count();
  if(!docsNumber) {
    const numberFaker = 5000;
    _.times(numberFaker, () => {
      const userProfile = {
        userId: internet.userName(),
        alias: internet.userName(),
        status: STATUS_ACTIVE
      }
      Actions.insert.call(userProfile);
    });
    console.log('Profiles: Created ' + numberFaker + ' fake data!');
  }
  else {
    // Get random User
    const randomUser = Profiles.findOne({});
    console.log('randomUser _id: ' + randomUser._id);

    // Profiles: Test - Method Update Name
    console.log('Profiles: Test - Method Update Name');
    userProfile = {
      userId: randomUser.userId,
      firstName: name.firstName(),
      lastName: name.lastName()
    };
    Actions.updateName.call(userProfile, (error) => {
      if(error)
        console.log('Fail: ' + error);
      else
        console.log('Pass');
    });

    // Profiles: Test - Method Update UmageUrl
    console.log('Profiles: Test - Method Update UmageUrl');
    userProfile = {
      userId: randomUser.userId,
      imageUrl: image.imageUrl()
    };
    Actions.updateImageUrl.call(userProfile, (error) => {
      if(error)
        console.log('Fail: ' + error);
      else
        console.log('Pass');
    });

    // Profiles: Test - Method Update Status
    console.log('Profiles: Test - Method Update Status');
    userProfile = {
      userId: randomUser.userId,
      status: STATUS_DEACTIVE
    };
    Actions.updateStatus.call(userProfile, (error) => {
      if(error)
        console.log('Fail: ' + error);
      else
        console.log('Pass');
    });
  }
};
