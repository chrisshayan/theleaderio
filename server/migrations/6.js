import {Meteor} from 'meteor/meteor';
import {Feedbacks} from '/imports/api/feedbacks/index';
import {Questions} from '/imports/api/questions/index';

// functions
import {monkeyClassifyTopic} from '/imports/api/monkey/functions';

Migrations.add({
  version: 6,
  name: "get tags for feedback and questions",
  up() {
    const
      feedbacks = Feedbacks.find({tags: {$exists: false}}, {fields: {_id: true, feedback: true}}).fetch(),
      questions = Questions.find({tags: {$exists: false}}, {fields: {_id: true, question: true}}).fetch()
      ;

    // get tags for non exists one
    if (!_.isEmpty(feedbacks)) {
      feedbacks.map(feed => {
        const
          {_id, feedback} = feed
          ;
        const
          text_list = [feedback],
          tags = monkeyClassifyTopic({text_list})
          ;

        if (!_.isEmpty(tags)) {
          Feedbacks.update({_id}, {$set: {tags}});
        }

      });
    }

    if (!_.isEmpty(questions)) {
      questions.map(ques => {
        const
          {_id, question} = ques
          ;
        const
          text_list = [question],
          tags = monkeyClassifyTopic({text_list})
          ;

        if (!_.isEmpty(tags)) {
          Questions.update({_id}, {$set: {tags}});
        }

      });
    }
  }
});