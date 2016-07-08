import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';

import NoticeForm from '/imports/ui/common/NoticeForm';
import * as SubdomainActions from '/imports/utils/subdomain';

export default class ThankyouPage extends Component {
  componentWillMount() {
    Meteor.logout();
  }

  componentWillUnmount() {
    SubdomainActions.removeSubdomain({route: ''});
  }

  render() {

    return (
      <div>
        <NoticeForm
          code='TL+'
          message = 'Thank you'
          description = 'We could become a good leader together. If you need go further with us.'
          buttonLabel = 'Let us know'
          redirectUrl = '/' // this should be the url to contact with admin
        />
      </div>
    );
  }
}