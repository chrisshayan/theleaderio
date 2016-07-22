import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

import {Profiles} from '/imports/api/profiles/index';
import {Industries} from '/imports/api/industries/index';

import * as ProfileActions from '/imports/api/profiles/methods';
import * as Notifications from '/imports/api/notifications/methods';

import ChosenIndustries from '/imports/ui/components/ChosenIndustries';
import UploadImage from '/imports/ui/components/UploadImage';
import Spinner from '/imports/ui/common/Spinner';

// EditProfile.propTypes = {
//   loading: React.PropTypes.bool,
//   profile: React.PropTypes.object,
//   industries: React.PropTypes.object
// };

class EditProfile extends Component {
  
  onSave() {
    const userId = Meteor.userId(),
      firstName = this.refs.firstName.value,
      lastName = this.refs.lastName.value,
      industries = this.refs.selectedIndustries.getValue(),
      phoneNumber = this.refs.phoneNumber.value,
      aboutMe = this.refs.aboutMe.value
      ;
    ProfileActions.edit.call({userId, firstName, lastName, industries, phoneNumber, aboutMe}, (error) => {
      if (!_.isEmpty(error)) {
      } else {
        const closeButton = true,
          timeOut = 2000,
          title = 'Edit profile',
          message = 'Saved'
        ;
        Notifications.success.call({closeButton, timeOut, title, message});
      }
    });
  }

  onUploadedImage(imageUrl) {
    const userId = Meteor.userId()
    ProfileActions.edit.call({userId, imageUrl}, (error) => {
      if (!_.isEmpty(error)) {
      } else {
        const closeButton = true,
          timeOut = 2000,
          title = 'Profile photo',
          message = 'Uploaded'
        ;
        Notifications.success.call({closeButton, timeOut, title, message});
      }
    });
  }

  render() {
    const {loading, profile, industries} = this.props;
    if (loading) {
      return (
        <div>
          <Spinner />
        </div>
      );
    } else {
      return (
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="row">
            <div className="col-md-4">
              <div className="ibox">
                <div className="ibox-title">
                  <h5>Profile photo</h5>
                </div>
                <UploadImage
                  imageUrl={profile.imageUrl}
                  onUploadedImage={this.onUploadedImage.bind(this)}
                />
              </div>
            </div>
            <div className="col-lg-8">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Edit your profile</h5>
                </div>
                <div className="ibox-content">
                  <form 
                    method="get" 
                    className="form-horizontal" 
                    onSubmit={(e) => {
                    e.preventDefault();
                    this.onSave();
                  }}>
                    <div className="form-group">
                      <label className="col-sm-3 control-label">First name</label>
                      <div className="col-sm-9">
                        <input ref="firstName" type="text" className="form-control"
                               defaultValue={profile.firstName} placeholder=""/>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-sm-3 control-label">Last name</label>
                      <div className="col-sm-9">
                        <input ref="lastName" type="text" className="form-control"
                               defaultValue={profile.lastName} placeholder="Khuu"/>
                      </div>
                    </div>
                    <div className="hr-line-dashed"></div>
                    <div className="form-group">
                      <label className="col-sm-3 control-label">Industries</label>
                      <div className="col-sm-9">
                        <ChosenIndustries
                          ref="selectedIndustries"
                          options={industries}
                          selectedIndustries={profile.industries}
                        />
                      </div>
                    </div>
                    <div className="hr-line-dashed"></div>
                    <div className="form-group">
                      <label className="col-sm-3 control-label">Phone number</label>
                      <div className="col-sm-9">
                        <input ref="phoneNumber" type="text" className="form-control" data-mask="(999) 999-9999"
                               defaultValue={profile.phoneNumber} placeholder="(84) 90 338 0797"/>
                      </div>
                    </div>
                    <div className="hr-line-dashed"></div>
                    <div className="form-group">
                      <label className="col-sm-3 control-label">About me</label>
                      <div className="col-sm-9">
                        <input ref="aboutMe" type="text" className="form-control"
                               defaultValue={profile.aboutMe} placeholder="Tell us something about you ...."/>
                      </div>
                    </div>
                    <div className="hr-line-dashed"></div>
                    <div className="form-group">
                      <div className="col-sm-4 col-sm-offset-3">
                        <button className="btn btn-primary" type="submit">
                          Save changes
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default EditProfileContainer = createContainer(({params}) => {
  // subscribe
  const subIndustries = Meteor.subscribe('industries.list');
  const subProfile = Meteor.subscribe('profiles');

  // check loading
  const loading = (!subIndustries.ready() & !subProfile.ready());

  // check exists
  const profile = Profiles.find({});
  const profileExists = !loading && !!profile;

  const industries = Industries.find({});
  const industriesExists = !loading && !!industries;
  return {
    loading,
    profile: profileExists ? profile.fetch()[0] : [],
    industries: industriesExists ? industries.fetch() : [],
  };
}, EditProfile);