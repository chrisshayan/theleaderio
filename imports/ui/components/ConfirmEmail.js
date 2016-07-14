import React, {Component} from 'react';

import Spinner from '/imports/ui/common/Spinner';
import NoticeForm from '/imports/ui/common/NoticeForm';

import {confirm as confirmEmail} from '/imports/api/users/methods';
import {remove as removeToken} from '/imports/api/tokens/methods';

export default class ConfirmEmail extends Component {

  componentWillMount() {
    const tokenId = FlowRouter.getQueryParam('token');
    if (typeof tokenId !== 'undefined') {
      confirmEmail.call({tokenId}, (error) => {
        if(_.isEmpty(error)) {
          removeToken.call({tokenId, action: 'email'});
        }
      });
    }
  }

  render() {
    return (
      <div>
        <NoticeForm
          code='TL+'
          message='Confirmed'
          description='Let improve your leadership together.'
          buttonLabel='HomePage'
        />
      </div>
    );
  }
}