import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

export default class ReferralsCollection extends Mongo.Collection {
  insert(doc, callback) {
    doc.createdAt = doc.updatedAt = new Date();
    if(_.isEmpty(doc.leaderId)) {
      doc.leaderId = this.userId;
    }

    return super.insert(doc, callback);
  }

  update(selector, modifier) {
    if (!modifier['$set']) modifier['$set'] = {};
    modifier['$set'].updatedAt = new Date();
    return super.update(selector, modifier);
  }
}