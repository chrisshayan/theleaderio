import { Mongo } from 'meteor/mongo';

export default class PreferencesCollection extends Mongo.Collection {
  insert(doc, callback) {
    doc.userId = Meteor.userId();
    return super.insert(doc, callback);
  }
}

