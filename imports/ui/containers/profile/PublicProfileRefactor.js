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
import Card2Columns from '/imports/ui/components/Card2Columns';
import CardProfilePhoto from '/imports/ui/components/CardProfilePhoto';
import CardDescription from '/imports/ui/components/CardDescription';
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
      const classGridLabel = 'col-md-4', classGridValue = 'col-md-8';
      const basicContent = [
        {
          label: 'Senior Database Administrator',
          value: ''
        },
        {
          label: profile.industry,
          value: ''
        }
      ];
      const contactContent = [
        {
          label: 'Phone',
          value: profile.phoneNumber
        },
        {
          label: 'Email',
          value: 'jackiekhuu@gmail.com'
        }
      ];
      const summaryContent = [
        {
          label: 'Organization',
          value: profile.noOrg
        },
        {
          label: 'Employees',
          value: profile.noEmployees
        },
        {
          label: 'Feedbacks',
          value: profile.noFeedbacks
        }];
      return (
        <div id="page-top" className="gray-bg">
          <div id="page-wrapper" className="gray-bg">
            <nav id="left-nav" className="left-nav">
            </nav>
            <TopNav
              navClass="row border-bottom"
            />
            <div className="wrapper wrapper-content">
              <div className="row">
                <div className="ibox float-e-margins">
                  <div className="col-md-10 no-padding">
                    <div className="ibox-title">
                      <ul className="list-inline social-icon pull-right">
                        <li>
                          <a href="https://www.linkedin.com/in/jeffboss236" className="text-navy">
                            <i className="fa fa-linkedin"></i>
                          </a>
                        </li>
                        <li>
                          <a href="https://twitter.com/JeffBoss9" className="text-navy">
                            <i className="fa fa-twitter"></i>
                          </a>
                        </li>
                        <li>
                          <a href="https://www.facebook.com/Adaptabilitycoach/" className="text-navy">
                            <i className="fa fa-facebook"></i>
                          </a>
                        </li>
                      </ul>
                      <h5>Public Profile</h5>
                    </div>
                  </div>
                  <div className="col-md-4 no-padding">
                    <div className="ibox-content gray-bg">
                      <div className="row">
                        <div className="ibox float-e-margins">
                          <CardProfilePhoto
                            imageClass="img-thumbnail"
                            imageUrl={profile.picture}
                            width={360}
                            height={360}
                          />
                          <Card2Columns
                            cardTitle={profile.name}
                            cardContent={basicContent}
                            classGridLabel='col-md-12'
                            classGridValue='col-md-0'
                          />

                          {(profile.phoneNumber) && (
                            <Card2Columns
                              cardTitle="Contact"
                              cardContent={contactContent}
                              classGridLabel={classGridLabel}
                              classGridValue={classGridValue}
                            />
                          )}
                          {(profile.noOrg || profile.noEmployees || profile.noFeedbacks) && (
                            <Card2Columns
                              cardTitle="Summary"
                              cardContent={summaryContent}
                              classGridLabel={classGridLabel}
                              classGridValue={classGridValue}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 no-padding">
                    <div className="ibox-content gray-bg">
                      <div className="row">
                        <div className="ibox float-e-margins" style={{marginBottom: 18}}>
                          <div className="ibox-title">
                            <h5>Leadership progress (not implemented)</h5>
                          </div>
                          <div className="ibox-content">
                            <div>
                              <canvas id="lineChart" height="140"></canvas>
                            </div>
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
                      {profile.aboutMe && (
                        <div className="row">
                          <CardDescription
                            cardTitle='Objective'
                            cardContent={profile.aboutMe}
                            height={171}
                          />
                        </div>
                      )}
                      <div className="row">
                        <div className="ibox float-e-margins">
                          <div className="ibox-title">
                            <h5>Organizations</h5>
                          </div>
                          <div className="ibox-content">
                            <h4>Head of Engineering</h4>
                            <p>Icare benefit</p>
                            <div><span>Overall</span>
                              <div className="stat-percent">48%</div>
                              <div className="progress progress-mini">
                                <div className="progress-bar"></div>
                              </div>
                            </div>
                            <div className="row  m-t-sm">
                              <div className="col-sm-6">
                                <small className="stats-label">Employees</small>
                                <h4>2</h4>
                              </div>
                              <div className="col-sm-6">
                                <small className="stats-label">Feedbacks</small>
                                <h4>24</h4>
                              </div>
                            </div>
                          </div>
                          <div className="ibox-content">
                            <h4>Head of Product</h4>
                            <p>Navigos Group</p>
                            <div><span>Overall</span>
                              <div className="stat-percent">48%</div>
                              <div className="progress progress-mini">
                                <div className="progress-bar"></div>
                              </div>
                            </div>
                            <div className="row  m-t-sm">
                              <div className="col-sm-6">
                                <small className="stats-label">Employees</small>
                                <h4>22</h4>
                              </div>
                              <div className="col-sm-6">
                                <small className="stats-label">Feedbacks</small>
                                <h4>44</h4>
                              </div>
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