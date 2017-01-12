import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {setPageHeading, resetPageHeading} from '/imports/store/modules/pageHeading';

// collections
import {Questions} from '/imports/api/questions/index';

// methods
import {verify as verifyQuestionsUrl} from '/imports/api/questions/methods';

// components
import {FAQItems} from '/imports/ui/components/FAQItems';
import Indicator from '/imports/ui/common/LoadingIndicator';
import NoFeedback from '/imports/ui/components/NoContent';
import AskSingleQuestion from './AskSingleQuestion';

class ViewQuestions extends Component {
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
      showAddDialog: false,
      error: ""
    };
  }

  componentWillUnmount() {
    resetPageHeading();
  }

  _onClickShowDialog = e => {
    this.setState({showAddDialog: true});
  };

  _onDismissDialog = e => {
    this.setState({showAddDialog: false});
  };

  onLoadMore = e => {
    e.preventDefault();
    const currentPage = Session.get('QUESTIONS_TO_LEADER_PAGE');
    Session.set('QUESTIONS_TO_LEADER_PAGE', currentPage + 1);
  };

  render() {
    const
      {ready, questions, page, hasMore} = this.props,
      noOfQuestions = questions.length,
      allowEditAnswer = false
      ;
    let
      leaderId = "",
      organizationId = ""
      ;

    if(!_.isEmpty(questions)) {
      const [question] = questions;
      leaderId = question.leaderId;
      organizationId = question.organizationId;
    }

    if (ready) {
      return (
        <div className="row gray-bg">
          <div className="col-md-10 col-md-offset-1">
            <div className="wrapper wrapper-content animated fadeInRight">
              <div className="ibox-content m-b-sm border-bottom">
                <div className="text-center p-lg">
                  <h2>{"If you don't find the answer to your question"}</h2>
                  <span>add your question by selecting </span>
                  <button title="Create new cluster"
                          className="btn btn-primary btn-sm"
                          onClick={this._onClickShowDialog}
                  >
                    <i className="fa fa-plus"></i>
                    <span className="bold">{' '}Add question</span>
                  </button>
                </div>
              </div>
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
          <AskSingleQuestion
            show={this.state.showAddDialog}
            onDismiss={this._onDismissDialog}
            leaderId={leaderId}
            organizationId={organizationId}
          />
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

export default ViewQuestionsContainer = createContainer((params) => {
  let page = parseInt(Session.get('QUESTIONS_TO_LEADER_PAGE'));
  if (_.isNaN(page)) page = 1;
  const
    {organizationId} = params,
    limit = page * 10,
    selector = {organizationId},
    option = {
      sort: {date: -1},
      limit: limit
    },
    sub = Meteor.subscribe('questions.public', page, organizationId),
    questions = Questions.find(selector, option).fetch(),
    total = Questions.find(selector).count()
    ;

  return {
    ready: sub.ready(),
    questions,
    page,
    hasMore: total > limit
  };
}, ViewQuestions);