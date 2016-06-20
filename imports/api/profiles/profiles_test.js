import { name, internet, image, address, helpers } from 'faker';
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
      Actions.createProfile.call(userProfile);
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
    Actions.editName.call(userProfile, (error) => {
      if(error)
        console.log('Fail: ' + error);
      else
        console.log('Pass');
    });

    // Profiles: Test - Method Update Address
    console.log('Profiles: Test - Method Update Address');
    const userAddress = helpers.createCard().address;
    userProfile = {
      userId: randomUser.userId,
      address: {
        zipCode: userAddress.zipcode,
        countryCode: address.countryCode(),
        country: userAddress.country,
        city: userAddress.city,
        district: address.county(),
        streetName: userAddress.streetA,
        streetAddress: address.streetAddress(),
        secondaryAddress: address.secondaryAddress(),
        geo: {
          latitude: userAddress.geo.lat,
          longitude: userAddress.geo.lng
        }
      }
    };
    Actions.editAddress.call(userProfile, (error) => {
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
    Actions.editImageUrl.call(userProfile, (error) => {
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
    Actions.editStatus.call(userProfile, (error) => {
      if(error)
        console.log('Fail: ' + error);
      else
        console.log('Pass');
    });
  }
};
