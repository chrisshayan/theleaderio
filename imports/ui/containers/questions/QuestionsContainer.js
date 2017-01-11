import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

// collections
import {Questions} from '/imports/api/questions/index';

class QuestionsComponent extends Component {
  render() {
    const {questions} = this.props;
    console.log(questions);
    return (
      <div>
        List all questions.
      </div>
    );
  }
}

export default QuestionsContainer = createContainer((params) => {
  const
    sub = Meteor.subscribe('questions'),
    questions = Questions.find().fetch()
  ;

  return {
    ready: sub.ready(),
    questions
  };
}, QuestionsComponent);