import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

// methods
import {ask as askQuestion, verify as verifyQuestionsUrl} from '/imports/api/questions/methods';

// functions
import {getSubdomain} from '/imports/utils/subdomain';
import * as Notifications from '/imports/api/notifications/functions';

// components
import ProfilePhoto from '/imports/ui/components/ProfilePhoto';
import NoticeForm from '/imports/ui/common/NoticeForm';
import Spinner from '/imports/ui/common/Spinner';
import HrDashed from '/imports/ui/components/HrDashed';

// constant
import {DOMAIN} from '/imports/startup/client/routes';

export default class AskQuestions extends Component {
  constructor() {
    super();

    this.state = {
      question: "",
      isValidated: true,
      error: ""
    };
  }

  componentWillMount() {
    const
      alias = getSubdomain(),
      {randomCode} = this.props
      ;

    verifyQuestionsUrl.call({alias, randomCode}, (error, result) => {
      if (error) {
        this.setState({
          isValidated: false,
          error: error.reason
        })
      } else {
        const {isValidated, imageUrl, header, leaderId, leaderName, organizationId} = result;
        this.setState({isValidated, imageUrl, header, leaderId, leaderName, organizationId});
      }
    });
  }

  _onSubmit() {
    const
      {question, leaderId, organizationId, leaderName} = this.state
      ;

    if (!_.isEmpty(question)) {
      askQuestion.call({leaderId, organizationId, question}, (error, result) => {
        if (error) {
          console.log(error);
          const
            closeButton = false,
            title = 'Error',
            message = error.reason;
          Notifications.error({
            closeButton,
            title,
            message
          });
        } else {
          const
            closeButton = false,
            title = 'Success',
            message = `Your question had been sent to ${leaderName}. Feel free to ask more questions.`;
          Notifications.success({
            closeButton,
            title,
            message
          });
        }
      });
      this.setState({question: ""});
    }
  }

  _onKeyPress = e => {
    if (e.which === 13 && !e.shiftKey) {
      e.preventDefault();
      this._onSubmit(e);
      return false;
    }
  };

  render() {
    const
      {question, error, isValidated, imageUrl, leaderName} = this.state,
      height = 100,
      homePageUrl = `http//:${DOMAIN}`
      ;

    if (isValidated) {
      return (
        <div className="create-screen journey-box animated fadeInDown">
          <div className="row text-left">
            <form className="form-horizontal" onSubmit={(event) => {
              event.preventDefault();
              this._onSubmit();
            }}>
              <div className="form-group pull-left">
                <h1 className="control-label">Ask <span style={{textTransform: 'capitalize'}}>{leaderName || 'leader'}</span>, any question:</h1>
              </div>
              <div className="form-group pull-left">
                <ProfilePhoto
                  imageUrl={imageUrl}
                  imageClass="form-control"
                  width={200}
                  height={200}
                />
              </div>
              <div className="form-group">
                <span className="form-control pull-left text-left"
                      style={{textTransform: 'capitalize', borderWidth: 0}}>
                To add a paragraph, press SHIFT + ENTER
                </span>
                <textarea
                  type="text"
                  className="form-control"
                  placeholder="Ex: How old are you?"
                  value={question}
                  style={{height}}
                  autoFocus={true}
                  onChange={e => this.setState({question: e.target.value})}
                  onKeyPress={this._onKeyPress.bind(this)}
                />
              </div>
              <div className="form-group pull-left">
                <button className="btn btn-primary" type="submit"
                        style={{marginRight: 19}}
                >Ok{" "}<i className="fa fa-check"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    } else if (!_.isEmpty(error)) {
      return (
        <NoticeForm
          code="404"
          message={error}
          description='Sorry, but the page you are looking for has note been found. Try checking the URL for error, then hit the refresh button on your browser or try found something else in our app.'
          buttonLabel='Go to HomePage'
          onSubmit={() => {FlowRouter.go(homePageUrl)}}
        />
      );
    } else {
      return (
        <Spinner />
      );
    }
  }
}