import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {Roles} from 'meteor/alanning:roles';

// collections
import {Articles} from './index';

// constants
import * as ERROR_CODE from '/imports/utils/error_code';

/**
 * Method create new article
 * @param {String} subject
 * @param {String} content html content from summernote
 * @param {Array} tags tags for the article, which could be generated from monkey learn
 */
export const create = new ValidatedMethod({
  name: "articles.create",
  validate: null,
  run({subject, content, tags, description, status, seoUrl}) {
    const
      user = Meteor.user()
      ;

    if(!_.isEmpty(user)) {
      if(Roles.userIsInRole(user._id, "admin")) {
        return Articles.insert({subject, content, tags, description, status, seoUrl});
      } else {
        return new Meteor.Error(ERROR_CODE.PERMISSION_DENIED);
      }
    } else {
      return new Meteor.Error(ERROR_CODE.UNAUTHORIZED, "No user found.");
    }
  }
});

/**
 * Method edit article
 * @param {String} subject
 * @param {String} content html content from summernote
 * @param {Array} tags tags for the article, which could be generated from monkey learn
 */
export const edit = new ValidatedMethod({
  name: "articles.edit",
  validate: null,
  run({_id, subject, content, tags, description, status}) {
    const
      user = Meteor.user()
      ;

    if(!_.isEmpty(user)) {
      if(Roles.userIsInRole(user._id, "admin")) {
        // console.log({
        //   _id,
        //   subject,
        //   content,
        //   tags,
        //   status
        // })
        return Articles.update({_id}, {$set: {subject, content, tags, description, status}});
      } else {
        return new Meteor.Error(ERROR_CODE.PERMISSION_DENIED);
      }
    } else {
      return new Meteor.Error(ERROR_CODE.UNAUTHORIZED, "No user found.");
    }
  }
});

/**
 * Method delete article
 * @param {String} _id
 */
export const discard = new ValidatedMethod({
  name: "articles.discard",
  validate: null,
  run({_id}) {
    const
      user = Meteor.user()
      ;

    if(!_.isEmpty(user)) {
      if(Roles.userIsInRole(user._id, "admin")) {
        return Articles.remove({_id});
      } else {
        return new Meteor.Error(ERROR_CODE.PERMISSION_DENIED);
      }
    } else {
      return new Meteor.Error(ERROR_CODE.UNAUTHORIZED, "No user found.");
    }
  }
});

/**
 * Method like article
 * @param {String} _id
 */
export const like = new ValidatedMethod({
  name: "articles.like",
  validate: null,
  run({_id}) {
    const
      user = Meteor.user()
      ;

    if(!_.isEmpty(user)) {
      return Articles.update({_id}, {$addToSet: {likes: user._id}});
    } else {
      return new Meteor.Error(ERROR_CODE.UNAUTHORIZED, "No user found.");
    }
  }
});

/**
 * Method unlike article
 * @param {String} _id
 */
export const unlike = new ValidatedMethod({
  name: "articles.unlike",
  validate: null,
  run({_id}) {
    const
      user = Meteor.user()
      ;

    if(!_.isEmpty(user)) {
      return Articles.update({_id}, {$pull: {likes: user._id}});
    } else {
      return new Meteor.Error(ERROR_CODE.UNAUTHORIZED, "No user found.");
    }
  }
});