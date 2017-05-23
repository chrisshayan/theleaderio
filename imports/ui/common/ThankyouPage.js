import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';

import NoticeForm from '/imports/ui/common/NoticeForm';

export default class ThankyouPage extends Component {
  componentWillMount() {
    Meteor.logout();
  }

  render() {
    const {
      description = 'We could become a good leader together. If you need go further with us.'
    } = this.props;
    return (
      <div>
        <NoticeForm
          code='TL+'
          message = 'Thank you'
          description = {description}
          buttonLabel = 'More about us.'
        />
      </div>
    );
  }
}