import React, {Component} from 'react';

import NoticeForm from '/imports/ui/common/NoticeForm';
import * as SubdomainActions from '/imports/utils/subdomain';

export default class ThankyouPage extends Component {
  render() {
    Meteor.logout();
    SubdomainActions.removeSubdomain({route: ''});
    return (
      <div>
        <NoticeForm
          code = 'TL+'
          message = 'Thank you'
          description = 'We could become a good leader together.'
          buttonLabel = 'Sign in'
          redirectUrl = '/'
        />
      </div>
    );
  }
}