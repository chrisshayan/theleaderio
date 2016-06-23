import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import _ from 'lodash';

import { Organizations, STATUS_ACTIVE, STATUS_DEACTIVE } from './index';
import { IDValidator } from '/imports/utils';

/**
 * CUD Organizations (Create, Edit, Deactivate)
 * Methods:
 * # create
 * # edit (name, description, imageUrl, address)
 * # setStatus
 */
// Create Organization
// with basics information: name
export const create = new ValidatedMethod({
  name: 'organizations.create',
  validate: new SimpleSchema({
    name: {
      type: String
    }
  }).validator(),
  run({ name }) {
    return Organizations.insert(name);
  }
});

// Edit Organization's name, description, imageUrl, address
export const edit = new ValidatedMethod({
  name: 'organizations.edit',
  validate: new SimpleSchema({
    ...IDValidator,
    name: {
      type: String,
      optional: true
    },
    description: {
      type: String,
      optional: true
    },
    imageUrl: {
      type: String,
      optional: true
    }
  }).validator(),
  run({ _id, name, description, imageUrl }) {
    var selector = { _id };
    var modifier = {};
    if(name != undefined) {
      modifier['name'] = name;
    }
    if(name != undefined) {
      modifier['name'] = name;
    }
    if(name != undefined) {
      modifier['name'] = name;
    }
    var org = Organizations.findOne({ _id });
    if(!org) {
      throw new Meteor.Error(404, 'Organization not found');
    } else if(!_.isEmpty(modifier)) {
      return Organizations.update(selector, {$set: modifier})
    } else {
      return true;
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
  run({ _id, address }) {
    var org = Organizations.findOne({ _id });
    if(!org) {
      throw new Meteor.Error(404, 'Organization not found');
    } else {
      return Organizations.update({ _id: org._id }, {
        $set: { address }});
    }
  }
});

// Set Organization's Status ( Activate or Deactivate)
export const setStatus = new ValidatedMethod({
  name: 'organizations.setStatus',
  validate: new SimpleSchema({
    ...IDValidator,
    status: {
      type: String,
      allowedValues: [  STATUS_ACTIVE, STATUS_DEACTIVE ]
    }
  }).validator(),
  run({ _id, status }) {
    var org = Organizations.findOne({ _id });
    if(!org) {
      throw new Meteor.Error(404, 'Organization not found');
    } else {
      return Organizations.update({ _id }, {
        $set: { status }});
    }
  }
});
