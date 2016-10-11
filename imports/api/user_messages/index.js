import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import UserMessagesCollection from './collection';

// COLLECTION
export const UserMessages = new UserMessagesCollection("user_messages");

// CONSTANTS
export const
  STATUS = {
    READ: "read",
    UNREAD: "unread"
  },
  TYPE = {
    SURVEY: "survey",
    FB_TO_LEADER: "feedbackToLeader",
    FB_TO_EMPLOYEE: "feedbackToEmployee"
  }
  ;

// SCHEMA
UserMessages.schema = new SimpleSchema({
  userId: {
    type: String
  },
  type: {
    type: String,
    allowedValues: [TYPE.SURVEY, TYPE.FB_TO_LEADER, TYPE.FB_TO_EMPLOYEE],
    optional: true
  },
  message: {
    type: Object,
    optional: true
  },
  "message.name": {
    type: String,
    optional: true
  },
  "message.detail": {
    type: String,
    optional: true
  },
  status: {
    type: String,
    allowedValues: [STATUS.READ, STATUS.UNREAD],
    defaultValue: STATUS.UNREAD,
    optional: true
  },
  date: {
    type: Date,
    defaultValue: new Date()
  }
});

UserMessages.attachSchema(UserMessages.schema);