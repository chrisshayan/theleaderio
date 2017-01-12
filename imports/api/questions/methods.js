import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {Questions} from './index';

// collections
import {Accounts} from 'meteor/accounts-base';
import {Organizations} from '/imports/api/organizations/index';
import {Profiles} from '/imports/api/profiles/index';

// functions
import {sendNotificationEmails} from './functions';

/**
 * Method ask question
 * @param {String} leaderId
 * @param {String} organizationId
 * @param {String} employeeId
 * @param {String} question
 */
export const ask = new ValidatedMethod({
  name: 'questions.ask',
  validate: new SimpleSchema({
    leaderId: {
      type: String
    },
    organizationId: {
      type: String
    },
    employeeId: {
      type: String,
      optional: true
    },
    question: {
      type: String
    }
  }).validator(),
  run({leaderId, organizationId, employeeId, question}) {
    // console.log({leaderId, organizationId, employeeId, question})
    return Questions.insert({leaderId, organizationId, employeeId, question});
  }
});

/**
 * Method ask question
 * @param {String} _id
 * @param {String} leaderId
 * @param {String} organizationId
 * @param {String} answer
 */
export const answer = new ValidatedMethod({
  name: 'questions.answer',
  validate: new SimpleSchema({
    _id: {
      type: String
    },
    leaderId: {
      type: String,
    },
    organizationId: {
      type: String
    },
    answer: {
      type: String
    }
  }).validator(),
  run({_id, leaderId, organizationId, answer}) {
    // console.log({_id, leaderId, organizationId, answer});
    const answerResult = Questions.update({_id, leaderId, organizationId}, {$set: {answer}});
    if(!this.isSimulation && answerResult) {
      // send defer emails to all employees {leaderId, organizationId, answer}
      Meteor.defer(() => {
        sendNotificationEmails(_id);
      });
    }
    return answerResult;
  }
});

/**
 * Method verify QNA Url
 * @param {String} alias
 * @param {String} organizationId / code
 */
export const verify = new ValidatedMethod({
  name: 'questions.verify',
  validate: new SimpleSchema({
    alias: {
      type: String
    },
    randomCode: {
      type: String
    }
  }).validator(),
  run({alias, randomCode}) {
    if(!this.isSimulation) {
      const
        user = Accounts.findUserByUsername(alias)
        ;

      if(!_.isEmpty(user)) {
        const
          leaderId = user._id,
          org = Organizations.findOne({leaderId, randomCode}, {fields: {_id: true, randomCode: true, leaderId: true}});

        if(!_.isEmpty(org)) {
          const
            profile = Profiles.findOne({userId: leaderId}),
            organizationId = org._id
            ;
          let result = {
            isValidated: true,
            header: 'Ask your leader any question:',
            imageUrl: '',
            leaderId,
            organizationId,
            leaderName: ""
          };
          if(!_.isEmpty(profile)) {
            result.header = `Ask ${profile.firstName}, any question:`;
            result.imageUrl = profile.imageUrl;
            result.leaderName = profile.firstName;
          }
          return result;
        } else {
          throw new Meteor.Error('INVALID_URL', 'URL is not exists.')
        }
      } else {
        throw new Meteor.Error('INVALID_ALIAS', 'Alias is not exists');
      }
    }
  }
});