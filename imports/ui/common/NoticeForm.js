import React, {Component} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';

import { DOMAIN } from '/imports/startup/client/routes';
import Copyright from '/imports/ui/common/Copyright';

export default class NoticeForm extends Component {
  _onSubmit() {
    if(_.isEmpty(this.props.redirectUrl)) {
      const newUrl = `http://${DOMAIN}/`;
      window.location = newUrl;
    } else {
      window.location = this.props.redirectUrl;
    }
  }

  render() {
    const {
      code = '404',
      message = 'Page Not Found',
      description = 'Sorry, but the page you are looking for has note been found. Try checking the URL for error, then hit the refresh button on your browser or try found something else in our app.',
      buttonLabel = 'Come back to HomePage',
      redirectUrl = '/',
      onSubmit = () => null
    } = this.props;

    return (
      <div className="middle-box text-center animated fadeInDown">
        <div>
          <div>
            <h1 className="logo-name" style={{textTransform: 'capitalize'}}>{ code }</h1>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="ibox-content">
                <h2 className="font-bold">{ message }</h2>
                <p>
                  { description }
                </p>
                <div className="row">
                  <div className="col-lg-12">
                    <form className="m-t" role="form" onSubmit={(event) => {
                      event.preventDefault();
                      this._onSubmit();
                    }}>
                      <button type="submit" className="btn btn-primary block full-width m-b">
                        { buttonLabel } <i className="fa fa-arrow-right"></i>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Copyright/>
        </div>
      </div>
    );
  }
}