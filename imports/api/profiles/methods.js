import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {Accounts} from 'meteor/accounts-base';
import _ from 'lodash';

// collections
import {Profiles, STATUS_ACTIVE, STATUS_INACTIVE} from './index';
import {Organizations} from '/imports/api/organizations/index';
import {Industries} from '/imports/api/industries/index';
import {Preferences} from '/imports/api/users/index';
import {Feedbacks} from '/imports/api/feedbacks/index';

import {IDValidator} from '/imports/utils';
import {DEFAULT_PUBLIC_INFO_PREFERENCES} from '/imports/utils/defaults';

// methods
import {addPreferences} from '/imports/api/users/methods';
import {getChartData} from '/imports/api/measures/methods';

// functions
import {getAverageMetrics} from '/imports/api/metrics/functions';

// constants
import * as ERROR_CODE from '/imports/utils/error_code';
import {DEFAULT_PROFILE_PHOTO} from '/imports/utils/defaults';

/**
 * CUD user profiles (Create, Update, Deactivate)
 * Methods:
 * # create
 * # edit
 * # editIndustries
 * # setStatus
 */
// Create User Preferences
// with basics information: userId, firstName, lastName, publicFields
export const create = new ValidatedMethod({
  name: 'profiles.create',
  validate: new SimpleSchema({
    userId: {
      type: String
    }, // validate userId which is mapped with _id in collection Accounts
    firstName: {
      type: String
    },
    lastName: {
      type: String,
      optional: true
    },
    timezone: {
      type: String
    }
  }).validator(),
  run({userId, firstName, lastName, timezone}) {
    const imageUrl = DEFAULT_PROFILE_PHOTO;
    return Profiles.insert({userId, firstName, lastName, timezone, imageUrl});
  }
});

// Edit User Preferences's Inforamtion
export const edit = new ValidatedMethod({
  name: 'profiles.edit',
  validate: new SimpleSchema({
    userId: {
      type: String
    }, // validate userId which is mapped with _id in collection Accounts
    firstName: {
      type: String,
      optional: true
    },
    lastName: {
      type: String,
      optional: true
    },
    title: {
      type: String,
      optional: true
    },
    industries: {
      type: [String],
      optional: true
    },
    imageUrl: {
      type: String,
      optional: true
    },
    phoneNumber: {
      type: String,
      optional: true
    },
    aboutMe: {
      type: String,
      optional: true
    }
  }).validator(),
  run({userId, firstName, lastName, title, industries, imageUrl, phoneNumber, aboutMe}) {
    const selector = {userId};
    const modifier = {};
    if (typeof firstName !== "undefined") {
      modifier['firstName'] = firstName;
    }
    if (typeof lastName !== "undefined") {
      modifier['lastName'] = lastName;
    }
    if (typeof title !== "undefined") {
      modifier['title'] = title;
    }
    if (typeof industries !== "undefined") {
      modifier['industries'] = industries;
    }
    if (typeof imageUrl !== "undefined") {
      modifier['imageUrl'] = imageUrl;
    }
    if (typeof phoneNumber !== "undefined") {
      modifier['phoneNumber'] = phoneNumber;
    }
    if (typeof aboutMe !== "undefined") {
      modifier['aboutMe'] = aboutMe;
    }
    const userProfile = Profiles.findOne(selector);
    if (!userProfile) {
      throw new Meteor.Error(404, 'User not found');
    } else if (!_.isEmpty(modifier)) {
      return Profiles.update(selector, {$set: modifier});
    } else {
      return true;
    }
  }
});

// Edit address
export const editAddress = new ValidatedMethod({
  name: 'profiles.editAddress',
  validate: new SimpleSchema({
    ...IDValidator, // validate userId which is mapped with _id in collection Accounts
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
  run({userId, address}) {
    var userProfile = Profiles.findOne({userId});
    if (!userProfile) {
      throw new Meteor.Error(404, 'User not found');
    } else {
      return Profiles.update({userId: userProfile.userId}, {
        $set: {address: userProfile.address}
      });
    }
  }
});

// Set Status (Activate / Deactivate)
export const setStatus = new ValidatedMethod({
  name: 'profiles.setStatus',
  validate: new SimpleSchema({
    userId: {
      type: String
    }, // validate userId which is mapped with _id in collection Accounts
    status: {
      type: String,
      allowedValues: [STATUS_ACTIVE, STATUS_INACTIVE]
    }
  }).validator(),
  run({userId, status}) {
    const userProfile = Profiles.findOne({userId});
    if (!userProfile) {
      throw new Meteor.Error(404, 'User not found');
    } else {
      return Profiles.update({userId}, {$set: {status}});
    }
  }
});

/**
 * @summary collect public data with the customization from user
 * @param {String} alias
 * @param {Boolean} isGetAll flag for getting all data or just the customization
 * @return {Object} all data for public profile
 */
export const getPublicData = new ValidatedMethod({
  name: "profiles.getPublicData",
  validate: new SimpleSchema({
    alias: {
      type: String
    },
    isGetAll: {
      type: Boolean
    }
  }).validator(),
  run({alias, isGetAll}) {
    if (!this.isSimulation) {
      const User = Accounts.findUserByUsername(alias);
      if (!_.isEmpty(User)) {
        const
          userId = User._id,
          leaderId = User._id,
          noOfPreferences = Preferences.find({userId, name: 'publicInfo'}).count(),
          ProfileData = Profiles.findOne({userId}),
          OrganizationsData = _.orderBy(Organizations.find({leaderId}).fetch(), ['startTime'], ['desc']),
          FeedbacksData = Feedbacks.find({leaderId}).fetch(),
          date = new Date(),
          months = [
            {
              month: date.getMonth(),
              name: moment(date).format('MMMM'),
              year: date.getFullYear()
            }
          ]
          ;
        let
          result = {
            basic: {
              name: null,
              industry: null
            },
            headline: {
              title: null
            },
            contact: {
              phone: null,
              email: null
            },
            summary: {
              noOrg: null,
              noEmployees: null,
              noFeedbacks: null
            },
            picture: {
              imageUrl: null
            },
            about: {
              aboutMe: null
            },
            organizations: [],
            chart: {},
            metrics: {
              overall: null,
              purpose: null,
              mettings: null,
              rules: null,
              communications: null,
              leadership: null,
              workload: null,
              energy: null,
              stress: null,
              decision: null,
              respect: null,
              conflict: null
            },
            preferences: {}
          },
          PreferencesData = {}
          ;

        // add default preferences for user if don't have
        //
        if (noOfPreferences == 0) {
          addPreferences.call({name: 'publicInfo', preferences: DEFAULT_PUBLIC_INFO_PREFERENCES});
        }

        // Get customize info,
        // which could be showed all (isGetAll = true)
        // or customized data only
        if(isGetAll) {
          PreferencesData = DEFAULT_PUBLIC_INFO_PREFERENCES;
        } else {
          PreferencesData = Preferences.find({userId: User._id}).fetch()[0].preferences;
          result.preferences = PreferencesData;
        }
        // Get preferences data
        const {headline, contact, summary, picture, about, organizations, metrics} = PreferencesData;

        // Get basic info, which always are showed
        // name
        if (!!ProfileData.firstName || !!ProfileData.lastName) {
          result.basic.name = `${ProfileData.firstName} ${ProfileData.lastName}`;
        }
        // industry
        if (!!ProfileData.industries) {
          result.basic.industry = Industries.findOne({_id: {$in: ProfileData.industries}}).name;
        }


        // get public data base on preferences
        // Headline
        if (headline.title && typeof headline.title !== 'undefined') {
          result.headline.title = !!ProfileData.title ? ProfileData.title : null;
        }

        // Contact
        // phoneNumber
        if (contact.phone && typeof contact.phone !== 'undefined') {
          result.contact.phone = !!ProfileData.phoneNumber ? ProfileData.phoneNumber : null;
        }
        // email
        if (contact.email && typeof contact.email !== 'undefined') {
          result.contact.email = User.emails[0].address;
        }

        // Summary
        // noOrg
        if (summary.noOrg && typeof summary.noOrg !== 'undefined') {
          const noOrg = OrganizationsData.length;
          result.summary.noOrg = (noOrg > 0) ? noOrg : null;
        }
        // noEmployees
        if (summary.noEmployees && typeof summary.noEmployees !== 'undefined') {
          if (OrganizationsData.length > 0) {
            let noEmployees = 0;
            OrganizationsData.map(organization => {
              noEmployees += organization.employees.length;
            });
            result.summary.noEmployees = (noEmployees > 0) ? noEmployees : null;
          }
        }
        // noFeedbacks
        if (summary.noFeedbacks && typeof summary.noFeedbacks !== 'undefined') {
          const noFeedbacks = FeedbacksData.length;
          result.summary.noFeedbacks = (noFeedbacks > 0) ? noFeedbacks : null;
        }

        // Picture
        if (picture.imageUrl && typeof picture.imageUrl !== 'undefined') {
          result.picture.imageUrl = !!ProfileData.imageUrl ? ProfileData.imageUrl : null;
        }

        // About
        // AboutMe
        if (about.aboutMe && typeof about.aboutMe !== 'undefined') {
          result.about.aboutMe = !!ProfileData.aboutMe ? ProfileData.aboutMe : null;
        }

        // Organizations
        if (organizations.show) {
          if (OrganizationsData.length > 0) {
            result.organizations = !_.isEmpty(OrganizationsData) ? OrganizationsData : [];
          }
        } else {
          result.organizations = [];
        }

        // Chart
        if(OrganizationsData.length > 0) {
          getChartData.call({
            leaderId,
            organizationId: OrganizationsData[0]._id,
            date: new Date(), noOfMonths: 6
          }, (error, chartData) => {
            if(!error) {
              result.chart = chartData;
            } else {
              console.log(error)
            }
          });
        } else {
          result.chart = [];
        }

        // Metrics
        if(!_.isEmpty(result.chart)) {
          result.metrics = getAverageMetrics(result.chart);
        }

        return result;
      } else {
        return Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND);
      }
    }
  }
});

// get profile information
export const getProfileInfo = new ValidatedMethod({
  name: 'profiles.getProfileInfo',
  validate: new SimpleSchema({
    alias: {
      type: String
    },
    requestField: {
      type: String,
      optional: true
    }
  }).validator(),
  run({alias, requestField}) {
    if (!this.isSimulation) {
      const user = Accounts.findUserByUsername(alias);
      if (!_.isEmpty(user)) {
        const profile = Profiles.findOne({userId: user._id});
        if (!_.isEmpty(profile)) {
          switch (requestField) {
            case 'name':
            {
              return `${profile.firstName} ${profile.lastName}`
            }
            default:
            {
              return profile.imageUrl
            }
          }
        } else {
          throw Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND);
        }
      } else {
        throw Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND);
      }

    }
  }
});


