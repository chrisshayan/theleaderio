import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Organizations, STATUS_ACTIVE, STATUS_DEACTIVE } from './index';
import { IDValidator } from '/imports/utils';

/**
 * CUD Organizations (Create, Edit, Deactivate)
 * Methods:
 * # validateOrg
 * # createOrg
 * # editName
 * # editDescription
 * # editAddress
 * # editImageUrl
 * # editStatus
 */
 // validate Organization
export const validateOrg = new ValidatedMethod({
  name: 'organizations.validateOrg',
  validate: new SimpleSchema({
    ...IDValidator
  }).validator(),
  run(org) {
    const docsNumber = Organizations.find({ _id: org._id }).count();
    if(!docsNumber) {
      return 0; // Invalid Organization
    } else {
      return 1; // Valid Organization
    }
  }
});

// Create Organization
// with basics information: name, status
export const createOrg = new ValidatedMethod({
  name: 'organizations.createOrg',
  validate: new SimpleSchema({
    name: {
      type: String
    },
    status: {
      type: String,
      allowedValues: [ STATUS_ACTIVE, STATUS_DEACTIVE ]
    }
  }).validator(),
  run(org) {
    return Organizations.insert(org);
  }
});

// Edit Organization Name
export const editName = new ValidatedMethod({
  name: 'organizations.editName',
  validate: new SimpleSchema({
    ...IDValidator,
    name: {
      type: String
    }
  }).validator(),
  run(org) {
    if(!validateOrg.call({_id: org._id})) {
      throw new Meteor.Error(400, 'Invalid Organization');
    } else {
      return Organizations.update({ _id: org._id }, {
        $set: { name: org.name }});
    }
  }
});

// Edit address
export const editAddress = new ValidatedMethod({
  name: 'organizations.editAddress',
  validate: new SimpleSchema({
    ...IDValidator,
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
  run(org) {
    if(!validateOrg.call({_id: org._id})) {
      throw new Meteor.Error(400, 'Invalid User');
    } else {
      return Organizations.update({ _id: org._id }, {
        $set: { address: org.address }});
    }
  }
});

// Edit Organization ImageUrl
export const editImageUrl = new ValidatedMethod({
  name: 'organizations.editImageUrl',
  validate: new SimpleSchema({
    ...IDValidator,
    imageUrl: {
      type: String
    }
  }).validator(),
  run(org) {
    if(!validateOrg.call({_id: org._id})) {
      throw new Meteor.Error(400, 'Invalid Organization');
    } else {
      return Organizations.update({ _id: org._id }, {
        $set: { imageUrl: org.imageUrl }});
    }
  }
});

// Edit Organization Description
export const editDescription = new ValidatedMethod({
  name: 'organizations.editDescription',
  validate: new SimpleSchema({
    ...IDValidator,
    description: {
      type: String
    }
  }).validator(),
  run(org) {
    if(!validateOrg.call({_id: org._id})) {
      throw new Meteor.Error(400, 'Invalid Organization');
    } else {
      return Organizations.update({ _id: org._id }, {
        $set: { description: org.description }});
    }
  }
});

// Edit Organization Status ( Activate or Deactivate)
export const editStatus = new ValidatedMethod({
  name: 'organizations.editStatus',
  validate: new SimpleSchema({
    ...IDValidator,
    status: {
      type: String,
      allowedValues: [  STATUS_ACTIVE, STATUS_DEACTIVE ]
    }
  }).validator(),
  run(org) {
    if(!validateOrg.call({_id: org._id})) {
      throw new Meteor.Error(400, 'Invalid Organization');
    } else {
      return Organizations.update({ _id: org._id }, {
        $set: { status: org.status }});
    }
  }
});
