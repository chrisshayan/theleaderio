import { Mongo } from 'meteor/mongo';

export default class ConfigsCollection extends Mongo.Collection {
  insert(doc, callback) {
    doc.userId = Meteor.userId();
    return super.insert(doc, callback);
  }
}

