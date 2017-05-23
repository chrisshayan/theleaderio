import React, {Component} from 'react';
import {SkyLightStateless} from 'react-skylight';
import {getErrors} from '/imports/utils';
import * as Notifications from '/imports/api/notifications/functions';

// methods
import {ask as askQuestion} from '/imports/api/questions/methods';

const initialState = {
  question: "",
  error: {}
};

export default class AskSingleQuestion extends Component {
  state = initialState

  reset = () => {
    this.setState(initialState);
  }

  _onCancel = e => {
    e && e.preventDefault();
    this.reset();
    this.props.onDismiss && this.props.onDismiss();
  }

  _onSave = e => {
    e.preventDefault();
    const
      {leaderId, organizationId} = this.props,
      {question} = this.state,
      data = {
        leaderId,
        organizationId,
        question,
      };
    // ask question here
    if (!_.isEmpty(question)) {
      askQuestion.call({leaderId, organizationId, question}, (error, result) => {
        if (error) {
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
            message = `Your question had been sent. Feel free to ask more questions.`;
          Notifications.success({
            closeButton,
            title,
            message
          });
        }
      });
      this.setState({question: ""});
    }
  };

  _onKeyPress = e => {
    if (e.which === 13 && !e.shiftKey) {
      e.preventDefault();
      this._onSave(e);
      return false;
    }
  };

  render() {
    const
      {show, onDismiss} = this.props,
      {question, error} = this.state,
      height = 100
      ;
    return (
      <SkyLightStateless
        isVisible={show}
        onCloseClicked={onDismiss}
        title={ 'Ask question:' }
        dialogStyles={{zIndex: 9999}}
        beforeOpen={this.reset}
      >
        <form onSubmit={this._onSave}>
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
          <div className="form-group">
            <a href="#" className="btn btn-default" onClick={this._onCancel.bind(this)}>Cancel</a>
            {' '}
            <button className="btn btn-primary" onClick={this._onSave.bind(this)}>Ok{" "}<i className="fa fa-check"></i></button>
          </div>
        </form>
      </SkyLightStateless>
    );
  }
}
