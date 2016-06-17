import { company, image } from 'faker';
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
      Actions.insert.call(org);
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
    Actions.updateName.call(org, (error) => {
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
    Actions.updateImageUrl.call(org, (error) => {
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
    Actions.updateDescription.call(org, (error) => {
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
    Actions.updateStatus.call(org, (error) => {
      if(error)
        console.log('Fail: ' + error);
      else
        console.log('Pass');
    });
  }
};
