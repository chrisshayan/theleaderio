import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import FeedbacksCollections from './collections';

export const Feedbacks = new FeedbacksCollections('feedbacks');

Feedbacks.schema = new SimpleSchema({
  
});