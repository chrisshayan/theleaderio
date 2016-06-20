import { company, image, helpers, address } from 'faker';
import _ from 'lodash';
import { Meteor } from 'meteor/meteor';

import { STATUS_ACTIVE, STATUS_DEACTIVE, Organizations } from '/imports/api/organizations';
import * as Actions from '/imports/api/organizations/methods';


/**
 * Fixtures & Tests for Organizations
 */
 export const organizationsTest = () => {
   // Create fake organizations
  const docsNumber = Organizations.find({}).count();
  if(!docsNumber) {
    const numberFaker = 200;
    _.times(numberFaker, () => {
      const org = {
        name: company.companyName(),
        status: STATUS_ACTIVE
      }
      Actions.createOrg.call(org);
    });
    console.log('Organizations: Created ' + numberFaker + ' fake data!');
  }
  else {
    // Get random Org
    const randomOrg = Organizations.findOne({});
    console.log('randomOrg _id: ' + randomOrg._id);

    // Organizations: Test - Method Update Name
    console.log('Organizations: Test - Method Update Name');
    org = {
      _id: randomOrg._id,
      name: company.companyName()
    };
    Actions.editName.call(org, (error) => {
      if(error)
        console.log('Fail: ' + error);
      else
        console.log('Pass');
    });

    // Organizations: Test - Method Update Address
    console.log('Organizations: Test - Method Update Address');
    const orgAddress = helpers.createCard().address;
    org = {
      _id: randomOrg._id,
      address: {
        zipCode: orgAddress.zipcode,
        countryCode: address.countryCode(),
        country: orgAddress.country,
        city: orgAddress.city,
        district: address.county(),
        streetName: orgAddress.streetA,
        streetAddress: address.streetAddress(),
        secondaryAddress: address.secondaryAddress(),
        geo: {
          latitude: orgAddress.geo.lat,
          longitude: orgAddress.geo.lng
        }
      }
    };
    Actions.editAddress.call(org, (error) => {
      if(error)
        console.log('Fail: ' + error);
      else
        console.log('Pass');
    });

    // Organizations: Test - Method Update UmageUrl
    console.log('Organizations: Test - Method Update UmageUrl');
    org = {
      _id: randomOrg._id,
      imageUrl: image.imageUrl()
    };
    Actions.editImageUrl.call(org, (error) => {
      if(error)
        console.log('Fail: ' + error);
      else
        console.log('Pass');
    });

    // Organizations: Test - Method Update Description
    console.log('Organizations: Test - Method Update Description');
    org = {
      _id: randomOrg._id,
      description: company.catchPhrase()
    };
    Actions.editDescription.call(org, (error) => {
      if(error)
        console.log('Fail: ' + error);
      else
        console.log('Pass');
    });

    // Organizations: Test - Method Update Status
    console.log('Organizations: Test - Method Update Status');
    org = {
      _id: randomOrg._id,
      status: STATUS_DEACTIVE
    };
    Actions.editStatus.call(org, (error) => {
      if(error)
        console.log('Fail: ' + error);
      else
        console.log('Pass');
    });
  }
};