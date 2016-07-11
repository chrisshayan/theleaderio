import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';

import { DOMAIN } from '/imports/startup/client/routes';
import NoticeForm from '/imports/ui/common/NoticeForm';
import * as SubdomainActions from '/imports/utils/subdomain';

export default class ThankyouPage extends Component {
  componentWillMount() {
    Meteor.logout();
  }

  render() {
    return (
      <div>
        <NoticeForm
          code='TL+'
          message = 'Thank you'
          description = 'We could become a good leader together. If you need go further with us.'
          buttonLabel = 'Let us know'
        />
      </div>
    );
  }
}