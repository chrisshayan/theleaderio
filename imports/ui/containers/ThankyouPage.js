import React, {Component} from 'react';

import NoticeForm from '/imports/ui/common/NoticeForm';

export default class ThankyouPage extends Component {
  render() {
    Meteor.logout();
    return (
      <div>
        <NoticeForm
          code = 'TL+'
          message = 'Thank you'
          description = 'We could become a good leader together.'
          buttonLabel = 'Come back to HomePage'
          redirectUrl = '/'
        />
      </div>
    );
  }
}