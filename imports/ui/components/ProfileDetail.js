import React, {Component} from 'react';

import ProfilePhoto from '/imports/ui/components/ProfilePhoto';

export default class ProfileDetail extends Component {

  render() {
    const {profile} = this.props;
    console.log(profile);
    return (
      <div>
        <div className="gray-bg row">
          <div className="col-md-12">
            <ProfilePhoto
              imageUrl={profile.imageUrl}
              width={325}
              height={325}
            />
          </div>
        </div>
        <div className="ibox float-e-margins">
          <div className="ibox-content profile-content">
            <h4><strong>{profile.mame}</strong></h4>
            <p><i className="fa fa-bank"></i> Current Organization</p>
            {}
            {!_.isEmpty(profile.industry) && (
              <p><i className="fa fa-building"></i>{' '} {profile.industry}</p>
            )}
            {profile.phoneNumber && (
              <p><i className="fa fa-phone"></i>{' '}{profile.phoneNumber}</p>
            )}
            {profile.aboutMe && (
              <div>
                <h5>About me</h5>
                <p>
                  {profile.aboutMe}
                </p>
              </div>
            )}
            <div className="row m-t-lg">
              <div className="col-md-4">
                <h5><strong>28</strong> Organizations</h5>
              </div>
              <div className="col-md-4">
                <h5><strong>149</strong> Employees</h5>
              </div>
              <div className="col-md-4">
                <h5><strong>240</strong> Feedbacks</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}