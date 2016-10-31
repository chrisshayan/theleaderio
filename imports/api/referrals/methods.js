import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {LoggedInMixin} from 'meteor/tunifight:loggedin-mixin';
import {Accounts} from 'meteor/accounts-base';

// collection
import {Referrals, STATUS} from './index';

// constants
import * as ERROR_CODE from '/imports/utils/error_code';

/**
 * Method create referral
 * @param {String} firstName
 * @param {String} lastName
 * @param {String} email
 */
export const create = new ValidatedMethod({
  name: "referral.create",
  mixins : [LoggedInMixin],
  checkLoggedInError: {
    error: ERROR_CODE.UNAUTHENTICATED,
    message: 'You need to be logged in to call this method',//Optional
    reason: 'You need to login' //Optional
  },
  validate: new SimpleSchema({
    firstName: {
      type: String
    },
    lastName: {
      type: String,
      optional: true
    },
    email: {
      type: String
    }
  }).validator(),
  run({params}) {
    const
      {firstName, lastName, email} = params,
      leaderId = Meteor.userId(),
      status = STATUS.INVITED
    ;

    // create the referral
    return Referrals.insert({leaderId, firstName, lastName, email, status});
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
    _id: {
      type: String
    },
    status: {
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
  mixins : [LoggedInMixin],
  checkLoggedInError: {
    error: ERROR_CODE.UNAUTHENTICATED,
    message: 'You need to be logged in to call this method',//Optional
    reason: 'You need to login' //Optional
  },
  validate: new SimpleSchema({
    referralId: {
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
        referral = Referrals.findOne({_id: referralId, status: STATUS.WAITING});
        ;

      if(!_.isEmpty(referral)) {
        if(_.isEmpty(Accounts.findUserByEmail(referral.email))) {
          // create User
          const user = Accounts.createUser({email});

          console.log(user)
          // should optimize onCreateUser to:
          //  create Profile
          //  create scheduler
          //  create Token


          // send invitation
        } else {
          throw new Meteor.Error(`${referral.email} is a leader already!`);
        }
      } else {
        throw new Meteor.Error(`Referral ${referralId} isn't in WAITING status!`)
      }
    }
  }
});