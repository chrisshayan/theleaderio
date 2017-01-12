import React, {Component} from 'react';
import XEditable from '/imports/ui/components/XEditable';
import moment from 'moment';

export class FAQItems extends Component {
  render() {
    const {items, isEditable = false} = this.props;
    return (
      <div>
        {items.map(item => {
          const
            {
              _id,
              leaderId,
              organizationId,
              question = "",
              answer,
              questionDate = new Date(),
              answerDate = new Date,
              tags = [],
              voting = 0
            } = item,
            today = new Date(),
            calendarFormat = {
              sameElse: 'MMM Do, YYYY'
            }
            ;

          return (
            <div className="faq-item" key={_id}>
              <div className="row">
                <div className="col-md-8">
                  <a data-toggle="collapse" href={`#${_id}`} className="faq-question">{question}</a>
                  <small>{'asked '}<i className="fa fa-clock-o"></i> {' '}
                    {moment(questionDate).calendar(today, calendarFormat)}
                  </small>
                </div>
                {!_.isEmpty(tags) && (
                  <div className="col-md-2">
                    <span className="small font-bold">Tags</span>
                    <div className="tag-list">
                      {tags.map((tag, key) => (
                        <button key={key} className="btn btn-white btn-xs" type="button">{tag} {' '}</button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="col-md-2 text-right pull-right">
                  <span className={_.isEmpty(answer) ? "label label-warning" : "label label-primary"}
                        style={{textTransform: 'capitalize'}}>
                  {_.isEmpty(answer) ? "unanswered" : "answered"}
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div id={_id} className="panel-collapse collapse ">
                    <div className="faq-answer white-bg">
                      <XEditable
                        key={_id}
                        backgroundColor="gray-bg"
                        valueName="answer"
                        placeHolder="There's no answer yet."
                        value={answer}
                        disabled={!isEditable}
                        method='questions.answer'
                        selector={{_id, leaderId, organizationId}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}