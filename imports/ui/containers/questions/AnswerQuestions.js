import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {setPageHeading, resetPageHeading} from '/imports/store/modules/pageHeading';

// collections
import {Questions} from '/imports/api/questions/index';

// components
import {FAQItems} from '/imports/ui/components/FAQItems';
import Indicator from '/imports/ui/common/LoadingIndicator';
import NoFeedback from '/imports/ui/components/NoContent';
import {Alert} from '/imports/ui/common/Alert';

class AnswerQuestions extends Component {
  constructor(props) {
    super(props);

    setPageHeading({
      title: 'Questions',
      breadcrumb: [{
        label: 'Questions',
        active: true
      }]
    });

    Session.setDefault('QUESTIONS_TO_LEADER_PAGE', 1);

    this.state = {
      error: ""
    };
  }

  componentWillUnmount() {
    resetPageHeading();
  }

  onLoadMore = e => {
    e.preventDefault();
    const currentPage = Session.get('QUESTIONS_TO_LEADER_PAGE');
    Session.set('QUESTIONS_TO_LEADER_PAGE', currentPage + 1);
  };

  render() {
    const
      {ready, questions, page, hasMore} = this.props,
      noOfQuestions = questions.length,
      allowEditAnswer = (_.isEmpty(Meteor.userId()) ? false : true)
      ;
    if(ready) {
      return (
        <div className="row gray-bg">
          <div className="col-md-12">
            <div className="wrapper wrapper-content animated fadeInRight">
              <Alert
                type="info"
                isDismissable={true}
                content={() => {return ("Click on the question to show the answer.");}}
              />
              {!_.isEmpty(questions) ? (
                <div>
                  <FAQItems
                    items={questions}
                    isEditable={allowEditAnswer}
                  />
                  {!ready && page > 1 && (
                    <Indicator />
                  )}
                  {hasMore && (
                    <button className="btn btn-primary btn-block" onClick={this.onLoadMore}>More questions</button>
                  )}
                </div>
              ) : (
              <NoFeedback icon="fa fa-question" message="There is no question."/>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Indicator />
        </div>
      );
    }
  }
}

export default AnswerQuestionsContainer = createContainer((params) => {
  let page = parseInt(Session.get('QUESTIONS_TO_LEADER_PAGE'));
  if (_.isNaN(page)) page = 1;
  const
    leaderId = Meteor.userId(),
    {organizationId} = params,
    limit = page * 10,
    selector = {leaderId, organizationId},
    option = {
      sort: {date: -1},
      limit: limit
    },
    sub = Meteor.subscribe('questions', page, organizationId),
    questions = Questions.find(selector, option).fetch(),
    total = Questions.find(selector).count()
    ;

  return {
    ready: sub.ready(),
    questions,
    page,
    hasMore: total > limit
  };
}, AnswerQuestions);