import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {LoggedInMixin} from 'meteor/tunifight:loggedin-mixin';
import {Accounts} from 'meteor/accounts-base';
import {words as capitalize} from 'capitalize';

// collection
import {Referrals, STATUS} from './index';
import {Profiles} from '/imports/api/profiles/index';
import {Tokens} from '/imports/api/tokens/index';

// methods
import {create as createProfile} from '/imports/api/profiles/methods';
import {generate as generateToken} from '/imports/api/tokens/methods';
import {send as sendEmail} from '/imports/api/email/methods';

// constants
import * as ERROR_CODE from '/imports/utils/error_code';
import {DEFAULT_SCHEDULER} from '/imports/utils/defaults';

/**
 * Method create referral
 * @param {String} firstName
 * @param {String} lastName
 * @param {String} email
 */
export const create = new ValidatedMethod({
  name: "referral.create",
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: ERROR_CODE.UNAUTHENTICATED,
    message: 'You need to be logged in to call this method',//Optional
    reason: 'You need to login' //Optional
  },
  validate: new SimpleSchema({
    params: {
      type: Object
    },
    "params.firstName": {
      type: String
    },
    "params.lastName": {
      type: String,
      optional: true
    },
    "params.email": {
      type: String
    }
  }).validator(),
  run({params}) {
    if (!Meteor.userId()) {
      throw new Meteor.Error(ERROR_CODE.UNAUTHORIZED, "User not found");
    }
    const
      {firstName, lastName, email} = params,
      leaderId = Meteor.userId(),
      // leaderId = Meteor.userId() || "abcd",
      status = STATUS.WAITING
      ;

    // create the referral
    return Referrals.insert({leaderId, firstName, lastName, email, status});
  }
});

/**
 * Method edit referral status
 * @param {String} _id
 * @param {String} userId
 */
export const edit = new ValidatedMethod({
  name: "referral.edit",
  validate: new SimpleSchema({
    params: {
      type: Object
    },
    "params._id": {
      type: String
    },
    "params.userId": {
      type: String
    },
  }).validator(),
  run({params}) {
    const
      {_id, userId} = params
      ;

    // set status for the referral
    return Referrals.update({_id}, {$set: {userId}});
  }
});


/**
 * Method set referral status
 * @param {String} _id
 * @param {String} status
 */
export const setStatus = new ValidatedMethod({
  name: "referral.setStatus",
  // mixins: [LoggedInMixin],
  // checkLoggedInError: {
  //   error: ERROR_CODE.UNAUTHENTICATED,
  //   message: 'You need to be logged in to call this method',//Optional
  //   reason: 'You need to login' //Optional
  // },
  validate: new SimpleSchema({
    params: {
      type: Object
    },
    "params._id": {
      type: String
    },
    "params.status": {
      type: String,
      allowedValues: [STATUS.INVITED, STATUS.CONFIRMED, STATUS.CANCELED, STATUS.WAITING],
    },
  }).validator(),
  run({params}) {
    const
      {_id, status} = params
      ;

    // don't need to login to cancel the invitation
    if(status === STATUS.CANCELED || status === STATUS.CONFIRMED) {
      // set status for the referral
      return Referrals.update({_id}, {$set: {status}});
    }

    if (!Meteor.userId()) {
      throw new Meteor.Error(ERROR_CODE.UNAUTHORIZED, "User not found");
    }
    // set status for the referral
    return Referrals.update({_id}, {$set: {status}});
  }
});

/**
 * Method send invitation
 * @param {String} firstName
 * @param {String} lastName
 * @param {String} email
 */
export const send = new ValidatedMethod({
  name: "referral.send",
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: ERROR_CODE.UNAUTHENTICATED,
    message: 'You need to be logged in to call this method',//Optional
    reason: 'You need to login' //Optional
  },
  validate: new SimpleSchema({
    params: {
      type: Object
    },
    "params.referralId": {
      type: String
    }
  }).validator(),
  run({params}) {
    if (!Meteor.userId()) {
      throw new Meteor.Error(ERROR_CODE.UNAUTHORIZED, "User not found");
    }
    if (!this.isSimulation) {
      const
        {referralId} = params,
        leaderId = Meteor.userId(),
        maxAllowInvitation = Meteor.settings.maxInvitation, // this value should get from settings file
        // leaderId = Meteor.userId() || "abcd",
        noOfInvited = Referrals.find({leaderId, status: STATUS.INVITED}).count(),
        referral = Referrals.findOne({_id: referralId, status: {$nin: [STATUS.CANCELED, STATUS.CONFIRMED]}, leaderId})
        ;

      if (!Roles.userIsInRole(leaderId, "admin")) {
        if (referral.status === STATUS.WAITING) {
          if (noOfInvited >= maxAllowInvitation) {
            throw new Meteor.Error(ERROR_CODE.UNAUTHORIZED, "leader reached the invitation limit.");
          }
        }
      }

      if (!_.isEmpty(referral)) {
        const
          {firstName, lastName, email} = referral,
          timezone = Meteor.settings.public.localTimezone,
          user = Accounts.findUserByEmail(email),
          leader = Profiles.findOne({userId: leaderId}),
          token = Tokens.findOne({email, action: 'referral'}),
          invitation = {}
          ;

        if (referral.status === STATUS.WAITING || _.isEmpty(user)) {
          // create User
          invitation.userId = Accounts.createUser({email});

          // create profile
          if (invitation.userId) {
            const {userId} = invitation;
            edit.call({params: {_id: referralId, userId}});
            invitation.profileId = createProfile.call({userId, firstName, lastName, timezone});

            // scheduler will be generated after user set their password

            // create Token
            if (invitation.profileId) {
              invitation.tokenId = generateToken.call({email, action: 'referral'});
            }
          }
        } else if (referral.status === STATUS.INVITED) {
          if (!_.isEmpty(user)) {
            invitation.userId = user._id;
            if (!_.isEmpty(leader)) {
              invitation.profileId = leader._id;
              if (!_.isEmpty(token)) {
                invitation.tokenId = token._id;
              }
            }
          } else {
            throw new Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND, `${email} was invited but has no account.`);
          }
        } else {
          return {};
        }

        // send invitation
        if (invitation.tokenId) {
          const
            leader = Profiles.findOne({userId: leaderId}),
            {tokenId, userId, profileId} = invitation,
            DOMAIN = Meteor.settings.public.domain,
            registerUrl = `http://${DOMAIN}/signup/referral?response=confirm&_id=${referralId}&token=${tokenId}`,
            cancelUrl = `http://${DOMAIN}/signup/referral?response=cancel&_id=${referralId}`,
            template = 'referral',
            data = {
              email,
              firstName: capitalize(firstName),
              registerUrl,
              cancelUrl,
              leaderId,
              userId,
              profileId,
              tokenId
            };


          if (!_.isEmpty(leader)) {
            data.leaderName = `${capitalize(leader.firstName)} ${capitalize(leader.lastName)}`;

            // send email
            invitation.sendEmail = sendEmail.call({template, data});

            // update status of referral to invited
            setStatus.call({params: {_id: referralId, status: STATUS.INVITED}});
            return invitation;
          }
        }
      } else {
        throw new Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND, `Referral ${referralId} is not found!`)
      }
    }
  }
});

/**
 * Method verify email of referral
 * @param {String} email
 * @return {Number} the number of referrals that match the email of that leader
 */
export const verify = new ValidatedMethod({
  name: "referrals.verify",
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: ERROR_CODE.UNAUTHENTICATED,
    message: 'You need to be logged in to call this method',//Optional
    reason: 'You need to login' //Optional
  },
  validate: new SimpleSchema({
    params: {
      type: Object
    },
    "params.email": {
      type: String
    }
  }).validator(),
  run({params}) {
    if (!Meteor.userId()) {
      throw new Meteor.Error(ERROR_CODE.UNAUTHORIZED, "User not found");
    }
    const
      leaderId = Meteor.userId(),
      {email} = params
      ;

    return Referrals.find({email, leaderId}).count();
  }
});

/**
 * Method remove referral
 * @param {String} _id
 * @return remove status
 */
export const remove = new ValidatedMethod({
  name: 'referrals.remove',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: ERROR_CODE.UNAUTHENTICATED,
    message: 'You need to be logged in to call this method',//Optional
    reason: 'You need to login' //Optional
  },
  validate: new SimpleSchema({
    params: {
      type: Object
    },
    "params._id": {
      type: {String}
    }
  }).validator(),
  run({params}) {
    if (!Meteor.userId()) {
      throw new Meteor.Error(ERROR_CODE.UNAUTHORIZED, "User not found");
    }
    const
      leaderId = Meteor.userId(),
      {_id} = params
      ;

    return Referrals.remove({_id, leaderId});
  }
});