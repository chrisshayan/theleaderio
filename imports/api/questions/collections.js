import {Mongo} from 'meteor/mongo';

export default class QuestionsCollection extends Mongo.Collection {
  insert(doc, callback) {
    if(_.isEmpty(doc.date)) {
      doc.date = new Date();
    }
    return super.insert(doc, callback);
  }
}