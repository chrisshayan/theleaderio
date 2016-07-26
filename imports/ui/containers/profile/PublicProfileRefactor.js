import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {words as capitalize} from 'capitalize';

// methods
import {getPublicData}  from '/imports/api/profiles/methods';
import {verify as verifyAlias} from '/imports/api/users/methods';

// components
import Spinner from '/imports/ui/common/Spinner';
import NoticeForm from '/imports/ui/common/NoticeForm';
import CopyRight from '/imports/ui/common/Copyright';
import TopNav from '/imports/ui/common/TopNav';
import IboxContentHorizontal from '/imports/ui/components/IboxContentHorizontal';
import IboxContentPhoto from '/imports/ui/components/IboxContentPhoto';
import IboxContentInline from '/imports/ui/components/IboxContentInline';

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
      const {basic, contact, summary, picture, about} = publicInfo;
      const basicContent = [
        {
          label: capitalize('Senior database administrator'),
          value: ''
        },
        {
          label: basic.industry,
          value: ''
        }
      ];
      const contactContent = [
        {
          label: 'Phone',
          value: contact.phone
        },
        {
          label: 'Email',
          value: contact.email
        }
      ];
      const summaryContent = {
        Organizations: summary.noOrg,
        Employees: summary.noEmployees,
        Feedbacks: summary.noFeedbacks
      };
      const aboutContent = [
        {
          label: about.aboutMe,
          value: ''
        }
      ];
      const metricsContent = [
        {
          Overall: 3.5,
          Purpose: 3.6,
          Mettings: 5,
          Rules: 4.1
        },
        {
          Communications: 2.3,
          Leadership: 4.4,
          Workload: 5,
          Energy: 3.4,
        },
        {
          Stress: 3.8,
          Decision: 3.9,
          Respect: 4,
          Conflict: 4.9
        }
      ];

      return (
        <div id="page-top">
          <div id="wrapper">
            <nav id="left-nav" className="left-nav">
            </nav>
          </div>
          <div id="page-wrapper" className="gray-bg">
            <TopNav
              navClass="row border-bottom"
            />
            <div className="wrapper wrapper-content">
              <div className="row">
                <div className="ibox float-e-margins">
                  <div className="col-md-10 col-md-offset-1 no-padding">
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
                  <div className="col-md-4 col-md-offset-1 no-padding">
                    <div className="ibox-content gray-bg">
                      <div className="row">
                        <div className="ibox float-e-margins">
                          <IboxContentPhoto
                            imageClass="img-thumbnail"
                            imageUrl={picture.imageUrl}
                            width={360}
                            height={360}
                          />
                          <IboxContentHorizontal
                            ibcTitle={capitalize(basic.name)}
                            ibcContent={basicContent}
                            classGridLabel='col-md-12'
                            classGridValue='col-md-0'
                          />

                          {(contact.phone || contact.email) && (
                            <IboxContentHorizontal
                              ibcTitle="Contact"
                              ibcContent={contactContent}
                              classGridLabel='col-md-4'
                              classGridValue='col-md-8'
                            />
                          )}
                          {(summary.noOrg || summary.noEmployees || summary.noFeedbacks) && (
                            <IboxContentInline
                              ibcTitle="Summary"
                              ibcContent={summaryContent}
                              classGrid="col-md-4"
                            />
                          )}
                          {about.aboutMe && (
                            <IboxContentHorizontal
                              ibcTitle='About'
                              ibcContent={aboutContent}
                              classGridLabel='col-md-12'
                              classGridValue='col-md-0'
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
                          <IboxContentInline
                            ibcContent={metricsContent[0]}
                            classGrid="col-md-3"
                          />
                          <IboxContentInline
                            ibcContent={metricsContent[1]}
                            classGrid="col-md-3"
                          />
                          <IboxContentInline
                            ibcContent={metricsContent[2]}
                            classGrid="col-md-3"
                          />
                        </div>
                      </div>
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