import React, {Component} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';

export default class InvalidUrl extends Component {
  _onSubmit() {
    console.log(this.props);
  }

  render() {
    const {
      code = '404',
      message = 'Page Not Found',
      description = 'Sorry, but the page you are looking for has note been found. Try checking the URL for error, then hit the refresh button on your browser or try found something else in our app.',
      buttonLabel = 'Come back to HomePage.',
      redirectUrl = '/'
    } = this.props;

    return (
      <div className="middle-box text-center animated fadeInDown">
        <h1>{ code }</h1>
        <h3 className="font-bold">{ message }</h3>

        <div className="error-desc">
          { description }
          <form className="form-inline m-t" role="form">
            <button type="submit" class="btn btn-primary"
                    onSubmit={this._onSubmit.bind(this)}>{ buttonLabel }</button>
          </form>
        </div>
      </div>
    );
  }
}