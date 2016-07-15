import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

import {Profiles} from '/imports/api/profiles/index';
import {Industries} from '/imports/api/industries/index';
import {getPublicData}  from '/imports/api/profiles/methods';

import Spinner from '/imports/ui/common/Spinner';
import NoticeForm from '/imports/ui/common/NoticeForm';

import TopNav from '/imports/ui/common/TopNav';
import ProfileDetail from '/imports/ui/components/ProfileDetail';
import LeadershipProgress from '/imports/ui/components/LeadershipProgress';
import Activities from '/imports/ui/components/Activities';

import * as UserActions from '/imports/api/users/methods';

export default class PublicProfile extends Component {
  constructor() {
    super();

    this.state = {
      loading: null,
      alias: null,
      profile: null
    };
  }

  componentWillMount() {
    this.setState({
      loading: true
    });
    const alias = Session.get('alias');
    UserActions.verify.call({alias}, (error) => {
      if (_.isEmpty(error)) {
        this.setState({
          alias: true
        });
        getPublicData.call({alias}, (error, result) => {
          if (_.isEmpty(error)) {
            this.setState({
              loading: false,
              profile: result
            });
          } else {
            this.setState({
              loading: false,
              errors: error.reason
            });
          }
        });
      } else {
        this.setState({
          alias: false,
          loading: false,
          errors: error.reason
        });
      }
    });
  }

  render() {
    const { profile, errors, loading, alias } = this.state;
    if (loading) {
      return (
        <div>
          <Spinner />
        </div>
      );
    }
    if (alias) {
      return (
        <div id="page-top" className="gray-bg">
          <TopNav />
          <div className="wrapper wrapper-content">
            <div className="row animated fadeInRight">
              <div className="col-md-4">
                <ProfileDetail
                  profile={profile}
                />
              </div>
              <div className="col-md-8">
                <LeadershipProgress />
              </div>
              <div className="col-md-8">
                <Activities />
              </div>
            </div>
          </div>
        </div>
      );
    } else if (!alias) {
      return (
        <div id="page-top" className="gray-bg">
          <NoticeForm
            code='404'
            message="Alias doesn't exists"
            description='Sorry, but the page you are looking for has note been found. Try checking the URL for error, then hit the refresh button on your browser or try found something else in our app.'
            buttonLabel='Come back to HomePage'
          />
        </div>
      );
    } else {
      return (
        <div>
          <Spinner />
        </div>
      );
    }
  }
}