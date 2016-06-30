import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';

import NoticeForm from '/imports/ui/common/NoticeForm';

export default class WelcomePage extends Component {
  componentWillMount() {
    Meteor.logout();
  }

  render() {

    return (
      <div>
        <NoticeForm
          code='TL+'
          message = 'Welcome to theLeader.io'
          description = 'Please check your mailbox to confirm your email and create your web address on theLeader.io. Having problem?'
          buttonLabel = 'Let us know'
          redirectUrl = '/' // this should be the url to contact with admin
        />
      </div>
    );
  }
}