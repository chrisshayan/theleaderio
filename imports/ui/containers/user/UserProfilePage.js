import React, {Component} from 'react';

import Spinner from '/imports/ui/common/Spinner';
import ProfileDetail from '/imports/ui/components/ProfileDetail';
import Activities from '/imports/ui/components/Activities';

export default class UserProfilePage extends Component {
  constructor() {
    super();

    this.state = {
      loading: false
    };
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <Spinner />
        </div>
      );
    } else {
      return (
        <div className="row animated fadeInRight">
          <div className="col-md-4">
            <ProfileDetail />
          </div>
          <div className="col-md-8">
            <Activities />
          </div>
        </div>
      );
    }
  }
}