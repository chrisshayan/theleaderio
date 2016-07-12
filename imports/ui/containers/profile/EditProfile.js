import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

<<<<<<< Updated upstream
import SelectIndustries from '/imports/ui/components/SelectIndustries';
import UploadImage from '/imports/ui/components/UploadImage';
import Spinner from '/imports/ui/common/Spinner';

class EditProfile extends Component {

  render() {
    const {loading, profile, industries} = this.props;
    // const profile = {
    //   firstName: 'Tan',
    //   lastName: 'Khuu',
    //   phoneNumber: '898809009',
    //   imageUrl: '/img/profile_big.jpg'
    // };
=======
import { Profiles } from '/imports/api/profiles/index';
import { Industries } from '/imports/api/industries/index';

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
    const profile = {
      userId: Meteor.userId(),
      firstName: this.refs.firstName.value,
      lastName: this.refs.lastName.value,
      industries: this.refs.selectedIndustries.getValue(),
      phoneNumber: this.refs.phoneNumber.value
    };
    console.log(profile);
  }

  render() {
    const {loading, profile, industries} = this.props;
>>>>>>> Stashed changes
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
            <div className="col-lg-8">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Edit your profile</h5>
                </div>
                <div className="ibox-content">
<<<<<<< Updated upstream
                  <form method="get" className="form-horizontal">
                    <div className="form-group">
                      <label className="col-sm-3 control-label">First name</label>
                      <div className="col-sm-9">
                        <input ref="firstName" type="text" className="form-control" value={profile.firstName}/>
=======
                  <form method="get" className="form-horizontal" onSubmit={(e) => {
                    e.preventDefault();
                    this.onSave();
                  }}>
                    <div className="form-group">
                      <label className="col-sm-3 control-label">First name</label>
                      <div className="col-sm-9">
                        <input ref="firstName" type="text" className="form-control"
                               defaultValue={profile.firstName} placeholder=""/>
>>>>>>> Stashed changes
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-sm-3 control-label">Last name</label>
                      <div className="col-sm-9">
<<<<<<< Updated upstream
                        <input ref="lastName" type="text" className="form-control" value={profile.lastName}/>
=======
                        <input ref="lastName" type="text" className="form-control"
                               defaultValue={profile.lastName} placeholder="Khuu"/>
>>>>>>> Stashed changes
                      </div>
                    </div>
                    <div className="hr-line-dashed"></div>
                    <div className="form-group">
<<<<<<< Updated upstream
                      <label className="col-sm-3 control-label">Industry</label>
                      <div className="col-sm-9">
                        <SelectIndustries />
=======
                      <label className="col-sm-3 control-label">Industries</label>
                      <div className="col-sm-9">
                        <ChosenIndustries
                          ref="selectedIndustries"
                          options = {industries}
                        />
>>>>>>> Stashed changes
                      </div>
                    </div>
                    <div className="hr-line-dashed"></div>
                    <div className="form-group">
                      <label className="col-sm-3 control-label">Phone number</label>
                      <div className="col-sm-9">
<<<<<<< Updated upstream
                        <input type="text" className="form-control" data-mask="(999) 999-9999"
                               value={profile.phoneNumber}/>
=======
                        <input ref="phoneNumber" type="text" className="form-control" data-mask="(999) 999-9999"
                               defaultValue={profile.phoneNumber} placeholder="(84) 90 338 0797"/>
>>>>>>> Stashed changes
                      </div>
                    </div>
                    <div className="hr-line-dashed"></div>
                    <div className="form-group">
                      <div className="col-sm-4 col-sm-offset-3">
<<<<<<< Updated upstream
                        <button className="btn btn-white" type="submit">Cancel</button>
                        {' '}
=======
>>>>>>> Stashed changes
                        <button className="btn btn-primary" type="submit">Save changes</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="ibox">
                <div className="ibox-title">
                  <h5>Profile photo</h5>
                </div>
                <UploadImage
                  imageUrl={profile.imageUrl}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default EditProfileContainer = createContainer(({ params }) => {
<<<<<<< Updated upstream
  const { id } = params;
  const todosHandle = Meteor.subscribe('todos.inList', id);
  const loading = !todosHandle.ready();
  const list = Lists.findOne(id);
  const listExists = !loading && !!list;
  return {
    loading,
    list,
    listExists,
    todos: listExists ? list.todos().fetch() : [],
=======
  // subscribe
  const subIndustries = Meteor.subscribe('industries.list');
  const subProfile = Meteor.subscribe('profiles');

  const loading = (!subIndustries.ready() & !subProfile.ready());

  const profile = Profiles.find({});
  const profileExists = !loading && !!profile;

  const industries = Industries.find({});
  const industriesExists = !loading && !!industries;
  return {
    loading,
    profile: profileExists ? profile.fetch()[0] : [],
    industries: industriesExists ? industries.fetch() : [],
>>>>>>> Stashed changes
  };
}, EditProfile);