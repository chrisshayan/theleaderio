import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {LoggedInMixin} from 'meteor/tunifight:loggedin-mixin';
import {Accounts} from 'meteor/accounts-base';

// collection
import {Referrals, STATUS} from './index';

// methods
import {create as createProfile} from '/imports/api/profiles/methods';
import {generate as generateToken} from '/imports/api/tokens/methods';
import {send as sendEmail} from '/imports/api/email/methods';
import {create as createScheduler} from '/imports/api/scheduler/methods';

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
  // mixins : [LoggedInMixin],
  // checkLoggedInError: {
  //   error: ERROR_CODE.UNAUTHENTICATED,
  //   message: 'You need to be logged in to call this method',//Optional
  //   reason: 'You need to login' //Optional
  // },
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
    const
      {firstName, lastName, email} = params,
      // leaderId = Meteor.userId(),
      leaderId = Meteor.userId() || "abcd",
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
  validate: new SimpleSchema({
    params: {
      type: Object
    },
    "params._id": {
      type: String
    },
    "params.status": {
      type: String,
      allowedValues: [STATUS.INVITED, STATUS.CONFIRMED],
    },
  }).validator(),
  run({params}) {
    const
      {_id, status} = params
      ;

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
export const invite = new ValidatedMethod({
  name: "referral.invite",
  // mixins : [LoggedInMixin],
  // checkLoggedInError: {
  //   error: ERROR_CODE.UNAUTHENTICATED,
  //   message: 'You need to be logged in to call this method',//Optional
  //   reason: 'You need to login' //Optional
  // },
  validate: new SimpleSchema({
    params: {
      type: Object
    },
    "params.referralId": {
      type: String
    }
  }).validator(),
  run({params}) {
    // if (!Meteor.userId()) {
    //   throw new Meteor.Error(ERROR_CODE.UNAUTHORIZED, "User not found");
    // }
    if (!this.isSimulation) {
      const
        {referralId} = params,
        // leaderId = Meteor.userId(),
        leaderId = Meteor.userId() || "abcd",
        referral = Referrals.findOne({_id: referralId, status: STATUS.WAITING, leaderId});
      ;

      if (!_.isEmpty(referral)) {
        const
          {firstName, lastName, email} = referral,
          timezone = Meteor.settings.public.localTimezone
          ;
        if (_.isEmpty(Accounts.findUserByEmail(email))) {
          const
            invitation = {}
            ;

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

          console.log(invitation);
          // send invitation
          if (invitation.tokenId) {
            const
              {tokenId} = invitation,
              DOMAIN = Meteor.settings.public.domain,
              url = `http://${DOMAIN}/signup/referral?token=${tokenId}`,
              template = 'referral',
              data = {
                email,
                firstName: firstName,
                url
              };

              // send email
            console.log({template, data})

          }

        } else {
          throw new Meteor.Error(`${referral.email} is a leader already!`);
        }
      } else {
        throw new Meteor.Error(`Referral ${referralId} isn't in WAITING status!`)
      }
    }
  }
});