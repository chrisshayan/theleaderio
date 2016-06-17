import { Meteor,  } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Organizations, STATUS_ACTIVE, STATUS_DEACTIVE } from './index';
import { IDValidator } from '/imports/utils';

/**
 * CUD user profiles (Create, Update, Deactivate)
 * Methods:
 * # validateOrg
 * # insert
 * # updateName
 * # updateDescription
 * # updateImageUrl
 * # updateStatus
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
export const insert = new ValidatedMethod({
  name: 'organizations.insert',
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

// Update Organization Name
export const updateName = new ValidatedMethod({
  name: 'organizations.updateName',
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

// Update Organization ImageUrl
export const updateImageUrl = new ValidatedMethod({
  name: 'organizations.updateImageUrl',
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

// Update Organization Description
export const updateDescription = new ValidatedMethod({
  name: 'organizations.updateDescription',
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

// Update Organization Status ( Activate or Deactivate)
export const updateStatus = new ValidatedMethod({
  name: 'organizations.updateStatus',
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
