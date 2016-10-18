import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import moment from 'moment-timezone';

// collections
import {Profiles} from '/imports/api/profiles/index';
import {Industries} from '/imports/api/industries/index';

// methods
import * as ProfileActions from '/imports/api/profiles/methods';
import * as Notifications from '/imports/api/notifications/methods';

// components
import Spinner from '/imports/ui/common/Spinner';
import ChosenIndustries from '/imports/ui/components/ChosenIndustries';
import UploadImage from '/imports/ui/components/UploadImage';
import FormInputHorizontal from '/imports/ui/components/FormInputHorizontal';
import FormTextArea from '/imports/ui/components/FormTextArea';
import HrDashed from '/imports/ui/components/HrDashed';


class EditProfile extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      profile: {
        firstName: '',
        lastName: '',
        title: '',
        phoneNumber: '',
        aboutMe: ''
      },
      industries: [],
      error: {}
    };

  }

  componentDidUpdate(prevProps) {
    if(!_.isEqual(prevProps, this.props)) {
      this.setState({
        loading: false,
        profile: this.props.profile,
        industries: this.props.industries
      });
    }
  }

  onSave() {
    const userId = Meteor.userId();
    const {firstName, lastName, title, phoneNumber, aboutMe} = this.state.profile;
    const industries = this.refs.selectedIndustries.getValue();
    ProfileActions.edit.call({userId, firstName, lastName, title, industries, phoneNumber, aboutMe}, (error) => {
      if (!_.isEmpty(error)) {
        const closeButton = true,
          timeOut = 2000,
          title = 'Edit profile',
          message = `Error: ${error.reason}`
          ;
        Notifications.warning.call({closeButton, timeOut, title, message});
      } else {
        const closeButton = true,
          timeOut = 2000,
          title = 'Edit profile',
          message = 'Saved'
          ;
        Notifications.success.call({closeButton, timeOut, title, message});
        window.Intercom('update',{
          user_id: userId,
          name: [firstName, lastName].join(' ')
        });
        window.trackEvent('update_profile');
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
          title = 'Preferences photo',
          message = 'Uploaded'
          ;
        Notifications.success.call({closeButton, timeOut, title, message});
      }
    });
  }

  render() {
    const {loading, error, profile, industries} = this.state;
    if (loading) {
      return (
        <div>
          <Spinner />
        </div>
      );
    } else {
      return (
        <div className="animated fadeInRight">
          <div className="row">
            <div className="col-md-4">
              <div className="ibox">
                <UploadImage
                  imageUrl={profile.imageUrl}
                  onUploadedImage={this.onUploadedImage.bind(this)}
                />
              </div>
            </div>
            <div className="col-lg-8">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Your information</h5>
                </div>
                <div className="ibox-content">
                  <form
                    method="get"
                    className="form-horizontal"
                    onSubmit={(e) => {
                    e.preventDefault();
                    this.onSave();
                  }}>
                    <FormInputHorizontal
                      label="First name"
                      type="text"
                      placeHolder=""
                      defaultValue={profile.firstName}
                      onChangeText={firstName => this.setState({profile: {...profile, firstName}})}
                    />
                    <HrDashed />
                    <FormInputHorizontal
                      label="Last name"
                      type="text"
                      placeHolder=""
                      defaultValue={profile.lastName}
                      onChangeText={lastName => this.setState({profile: {...profile, lastName}})}
                    />
                    <HrDashed />
                    <FormInputHorizontal
                      label="Title"
                      type="text"
                      placeHolder="... Head of Engineering"
                      defaultValue={profile.title}
                      onChangeText={title => this.setState({profile: {...profile, title}})}
                    />
                    <HrDashed />
                    <div className="form-group">
                      <label className="col-sm-3 control-label">Industries</label>
                      <div className="col-sm-9">
                        <ChosenIndustries
                          ref="selectedIndustries"
                          options={industries}
                          selectedIndustries={profile.industries}
                          isMultiple={true}
                        />
                      </div>
                    </div>
                    <HrDashed />
                    <FormInputHorizontal
                      label="Phone number"
                      type="text"
                      placeHolder="... 090 338 0797"
                      defaultValue={profile.phoneNumber}
                      onChangeText={phoneNumber => this.setState({profile: {...profile, phoneNumber}})}
                    />
                    <HrDashed />
                    <FormTextArea
                      label="About me"
                      type="text"
                      defaultValue={profile.aboutMe}
                      onTextChange={aboutMe => this.setState({profile: {...profile, aboutMe}})}
                    />
                    <HrDashed />
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