import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import _ from 'lodash';

import { IDValidator } from '/imports/utils';
import { Tokens } from '/imports/api/tokens/index';

/**
 *  @summary set alias for account which will use Account username as alias
 *  @param tokenId
 */
export const createAlias = new ValidatedMethod({
  name: 'users.createAlias',
  validate: new SimpleSchema({
    tokenId: {
      type: String
    },
    alias: {
      type: String
    }
  }).validator(),
  run({ tokenId, alias }) {
    if(!this.isSimulation) {
      // verify Token
      const token = Tokens.findOne({ _id: tokenId });
      if(!_.isEmpty(token)) {
        const email = token.email;
        const user = Accounts.findUserByEmail(email);
        if(!_.isEmpty(user)) {
          const userId = user._id;
          Accounts.setUsername(userId, alias);
          const verifyUser = Accounts.findUserByUsername(alias);
          if(_.isEmpty(verifyUser)) {
            throw new Meteor.Error('create-alias-failed',
              `Can not create user alias with tokenId=${tokenId} & alias=${alias}`);
          }
        }
      } else {
        throw new Meteor.Error('invalid-token', 'User token is invalid or has been used.');
      }
    }
  }
});