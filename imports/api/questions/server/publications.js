import {Meteor} from 'meteor/meteor';
import {Questions} from '../index';

Meteor.publish('questions', function (page = 1, organizationId) {
  check(page, Number);
  if (!this.userId) {
    return this.ready();
  }
  const
    selector = {leaderId: this.userId, organizationId},
    {searchLimit} = Meteor.settings,
    option = {
      fields: Questions.publicFields,
      limit: searchLimit,
      sort: {date: -1}
    };
  return Questions.find(selector, option);
});


Meteor.publish('questions.public', function (page = 1, organizationId) {
  check(page, Number);
  const
    selector = {organizationId},
    {searchLimit} = Meteor.settings.public,
    option = {
      fields: Questions.publicFields,
      limit: searchLimit,
      sort: {date: -1}
    };
  return Questions.find(selector, option);
});