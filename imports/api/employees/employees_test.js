import { name, image, address, helpers } from 'faker';
import _ from 'lodash';
import { Meteor } from 'meteor/meteor';

import { STATUS_ACTIVE, STATUS_DEACTIVE, Employees } from '/imports/api/employees';
import * as Actions from '/imports/api/employees/methods';


/**
 * Fixtures & Tests for Employees
 */
 export const employeesTest = () => {
   // Create fake employees
  const docsNumber = Employees.find({}).count();
  if(!docsNumber) {
    const numberFaker = 1500;
    _.times(numberFaker, () => {
      const { email } = helpers.createCard();
      const employee = {
        email: email,
        status: STATUS_ACTIVE
      }
      Actions.insert.call(employee);
    });
    console.log('Employees: Created ' + numberFaker + ' fake data!');
  }
  else {
    // Get random Org
    const randomEmployee = Employees.findOne({});
    console.log('randomEmployee _id: ' + randomEmployee._id);

    // Employees: Test - Method Update Name
    console.log('Employees: Test - Method Update Name');
    employee = {
      _id: randomEmployee._id,
      firstName: name.firstName(),
      lastName: name.lastName()
    };
    Actions.updateName.call(employee, (error) => {
      if(error)
        console.log('Fail: ' + error);
      else
        console.log('Pass');
    });

    // Employees: Test - Method Update Address
    console.log('Employees: Test - Method Update Address');
    const employeeAddress = helpers.createCard().address;
    employee = {
      _id: randomEmployee._id,
      address: {
        zipCode: employeeAddress.zipcode,
        countryCode: address.countryCode(),
        country: employeeAddress.country,
        city: employeeAddress.city,
        district: address.county(),
        streetName: employeeAddress.streetA,
        streetAddress: address.streetAddress(),
        secondaryAddress: address.secondaryAddress(),
        geo: {
          latitude: employeeAddress.geo.lat,
          longitude: employeeAddress.geo.lng
        }
      }
    };
    Actions.updateAddress.call(employee, (error) => {
      if(error)
        console.log('Fail: ' + error);
      else
        console.log('Pass');
    });

    // Employees: Test - Method Update UmageUrl
    console.log('Employees: Test - Method Update UmageUrl');
    employee = {
      _id: randomEmployee._id,
      imageUrl: image.imageUrl()
    };
    Actions.updateImageUrl.call(employee, (error) => {
      if(error)
        console.log('Fail: ' + error);
      else
        console.log('Pass');
    });

    // Employees: Test - Method Update Status
    console.log('Employees: Test - Method Update Status');
    employee = {
      _id: randomEmployee._id,
      status: STATUS_DEACTIVE
    };
    Actions.updateStatus.call(employee, (error) => {
      if(error)
        console.log('Fail: ' + error);
      else
        console.log('Pass');
    });
  }
};
