import React, {Component} from 'react';

import Spinner from '/imports/ui/common/Spinner';
import NoticeForm from '/imports/ui/common/NoticeForm';

// methods
import {setStatus} from '/imports/api/referrals/methods';

// constants
import {STATUS} from '/imports/api/referrals/index';

export default class CancelReferral extends Component {

  componentWillMount() {
    const _id = FlowRouter.getQueryParam('_id');
    if (typeof _id !== 'undefined') {
      setStatus.call({params: {_id, status: STATUS.CANCELED}});
    }
  }

  render() {
    return (
      <div>
        <NoticeForm
          code='TL+'
          message='Canceled'
          description='We are sad when you left. We could improve leadership together.'
          buttonLabel='Know more about us'
        />
      </div>
    );
  }
}