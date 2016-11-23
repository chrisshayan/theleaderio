import { Mongo } from 'meteor/mongo';
import {STATUS_ACTIVE} from './index';

class ProfilesCollection extends Mongo.Collection {
  // hook event before insert
  insert(doc, callback) {
    if(_.isEmpty(doc.status)) {
      doc.status = STATUS_ACTIVE;
    }
    return super.insert(doc, callback);
  }
}

export default ProfilesCollection;
