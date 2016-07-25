import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

// methods
import {getPublicData}  from '/imports/api/profiles/methods';
import {verify as verifyAlias} from '/imports/api/users/methods';

// components
import Spinner from '/imports/ui/common/Spinner';
import NoticeForm from '/imports/ui/common/NoticeForm';
import CopyRight from '/imports/ui/common/Copyright';
import TopNav from '/imports/ui/common/TopNav';
import ProfilePhoto from '/imports/ui/components/ProfilePhoto';
import ProfileDetail from '/imports/ui/components/ProfileDetail';
import LeadershipProgress from '/imports/ui/components/LeadershipProgress';
import Activities from '/imports/ui/components/Activities';

export default class PublicProfile extends Component {
  constructor() {
    super();

    this.state = {
      loading: null,
      alias: null,
      publicInfo: null
    };
  }

  componentWillMount() {
    this.setState({
      loading: true
    });
    const alias = Session.get('alias');
    verifyAlias.call({alias}, (error) => {
      if (_.isEmpty(error)) {
        this.setState({
          alias: true
        });
        getPublicData.call({alias}, (error, result) => {
          if (_.isEmpty(error)) {
            this.setState({
              loading: false,
              publicInfo: result
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
    const {publicInfo, errors, loading, alias} = this.state;
    if (loading) {
      return (
        <div>
          <Spinner />
        </div>
      );
    }
    if (alias) {
      const {profile} = publicInfo;
      return (
        <div id="wrapper">
          <div id="page-wrapper" className="gray-bg">
            <TopNav
              navClass="row border-bottom white-bg"
            />
            <div className="wrapper wrapper-content">
              <div className="row">
                <div className="ibox float-e-margins">
                  <div className="ibox-title">
                    <h5>Public Profile</h5>
                  </div>
                  <div className="col-md-8 no-padding">
                    <div className="ibox-content gray-bg">
                      <div className="row">
                        <div className="ibox float-e-margins">
                          <div className="ibox-title">
                            <span className="label label-info pull-right">July 14, 2016</span>
                            <h5>Leadership progress (not implemented)</h5>
                          </div>
                          <div className="ibox-content">
                            <div className="row">
                              <div className="col-xs-3">
                                <small className="stats-label">Overall</small>
                                <h4>1.8</h4>
                              </div>

                              <div className="col-xs-3">
                                <small className="stats-label">Purpose</small>
                                <h4>6.1</h4>
                              </div>
                              <div className="col-xs-3">
                                <small className="stats-label">Meetings</small>
                                <h4>2.0</h4>
                              </div>
                              <div className="col-xs-3">
                                <small className="stats-label">Rules</small>
                                <h4>2.0</h4>
                              </div>
                            </div>
                          </div>
                          <div className="ibox-content">
                            <div className="row">
                              <div className="col-xs-3">
                                <small className="stats-label">Communication</small>
                                <h4>1.1</h4>
                              </div>

                              <div className="col-xs-3">
                                <small className="stats-label">Leadership</small>
                                <h4>9.4</h4>
                              </div>
                              <div className="col-xs-3">
                                <small className="stats-label">Workload</small>
                                <h4>5.4</h4>
                              </div>
                              <div className="col-xs-3">
                                <small className="stats-label">Energy</small>
                                <h4>4.1</h4>
                              </div>
                            </div>
                          </div>
                          <div className="ibox-content">
                            <div className="row">
                              <div className="col-xs-3">
                                <small className="stats-label">Stress</small>
                                <h4>7.2</h4>
                              </div>

                              <div className="col-xs-3">
                                <small className="stats-label">Decision</small>
                                <h4>5.2</h4>
                              </div>
                              <div className="col-xs-3">
                                <small className="stats-label">Respect</small>
                                <h4>4.9</h4>
                              </div>
                              <div className="col-xs-3">
                                <small className="stats-label">Conflict</small>
                                <h4>3.1</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 no-padding">
                    <div className="ibox-content gray-bg">
                      <div className="row">
                        <div className="text-center gray-bg">
                          <ProfilePhoto
                            imageClass='img-thumbnail'
                            imageUrl={profile.picture}
                            width={360}
                            height={360}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="ibox float-e-margins" style={{marginBottom: 1}}>
                          <div className="ibox-content profile-content no-padding">
                            <div className="ibox-content">
                              <h3 style={{marginBottom: 5}}><strong>{profile.name}</strong></h3>
                              {!_.isEmpty(profile.orgName) && (
                                <h5>{profile.orgName}</h5>
                              )}
                              {!_.isEmpty(profile.industry) && (
                                <div className="row">
                                  <div className="col-md-5">
                                    Job category
                                  </div>
                                  <div className="col-md-7">
                                    {profile.industry}
                                  </div>
                                </div>
                              )}
                              {(profile.noOrg || profile.noEmployees || profile.noFeedbacks) && (
                                <div className="ibox-content no-padding">
                                  <h5><strong>Summary</strong></h5>
                                  <div className="row">
                                    {profile.noOrg && (
                                      <div className="col-md-4">
                                        <p><strong>{profile.noOrg}</strong> Organizations</p>
                                      </div>
                                    )}
                                    {profile.noEmployees && (
                                      <div className="col-md-4">
                                        <p><strong>{profile.noEmployees}</strong> Employees</p>
                                      </div>
                                    )}
                                    {profile.noFeedbacks && (
                                      <div className="col-md-4">
                                        <p><strong>{profile.noFeedbacks}</strong> Feedbacks</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              {profile.aboutMe && (
                                <div className="ibox-content no-padding">
                                  <h5><strong>About</strong></h5>
                                  <p>
                                    {profile.aboutMe}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      {(profile.phoneNumber) && (
                        <div className="row">
                          <div className="ibox float-e-margins">
                            <div className="ibox-content profile-content no-padding">
                              <div className="ibox-content">
                                  <h5><strong>Contact</strong></h5>
                                  {!_.isEmpty(profile.phoneNumber) && (
                                    <div className="row">
                                      <div className="col-md-5">
                                        Phone number
                                      </div>
                                      <div className="col-md-7">
                                        {profile.phoneNumber}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="row">
                        <div className="ibox float-e-margins">
                          <div className="ibox-content profile-content no-padding">
                            <div className="ibox-content">
                              <h3 style={{marginBottom: 5}}><strong>{profile.name}</strong></h3>
                              {!_.isEmpty(profile.orgName) && (
                                <h5>{profile.orgName}</h5>
                              )}
                              {!_.isEmpty(profile.industry) && (
                                <div className="row">
                                  <div className="col-md-5">
                                    Job category
                                  </div>
                                  <div className="col-md-7">
                                    {profile.industry}
                                  </div>
                                </div>
                              )}
                              {(profile.phoneNumber) && (
                                <div className="ibox-content no-padding">
                                  <h5><strong>Contact</strong></h5>
                                  {!_.isEmpty(profile.phoneNumber) && (
                                    <div className="row">
                                      <div className="col-md-5">
                                        Phone number
                                      </div>
                                      <div className="col-md-7">
                                        {profile.phoneNumber}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                              {(profile.noOrg || profile.noEmployees || profile.noFeedbacks) && (
                                <div className="ibox-content no-padding">
                                  <h5><strong>Summary</strong></h5>
                                  <div className="row">
                                    {profile.noOrg && (
                                      <div className="col-md-4">
                                        <p><strong>{profile.noOrg}</strong> Organizations</p>
                                      </div>
                                    )}
                                    {profile.noEmployees && (
                                      <div className="col-md-4">
                                        <p><strong>{profile.noEmployees}</strong> Employees</p>
                                      </div>
                                    )}
                                    {profile.noFeedbacks && (
                                      <div className="col-md-4">
                                        <p><strong>{profile.noFeedbacks}</strong> Feedbacks</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              {profile.aboutMe && (
                                <div className="ibox-content no-padding">
                                  <h5><strong>About</strong></h5>
                                  <p>
                                    {profile.aboutMe}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer">
              <CopyRight />
            </div>
          </div>
        </div>
      );
    } else if (!alias) {
      return (
        <NoticeForm
          code='404'
          message="Alias doesn't exists"
          description='Sorry, but the page you are looking for has note been found. Try checking the URL for error, then hit the refresh button on your browser or try found something else in our app.'
          buttonLabel='Come back to HomePage'
        />
      );
    } else {
      return (
        <Spinner />
      );
    }
  }
}