import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {words as capitalize} from 'capitalize';
import moment from 'moment';

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
import ProfilePhoto from '/imports/ui/components/ProfilePhoto';
import IboxContentOrganization from '/imports/ui/components/IboxContentOrganization';

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

            // line chart
            const lineData = {
              labels: ["January", "February", "March", "April", "May", "June", "July"],
              datasets: [
                {
                  label: "Example dataset",
                  fillColor: "rgba(220,220,220,0.5)",
                  strokeColor: "rgba(220,220,220,1)",
                  pointColor: "rgba(220,220,220,1)",
                  pointStrokeColor: "#fff",
                  pointHighlightFill: "#fff",
                  pointHighlightStroke: "rgba(220,220,220,1)",
                  data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                  label: "Example dataset",
                  fillColor: "rgba(26,179,148,0.5)",
                  strokeColor: "rgba(26,179,148,0.7)",
                  pointColor: "rgba(26,179,148,1)",
                  pointStrokeColor: "#fff",
                  pointHighlightFill: "#fff",
                  pointHighlightStroke: "rgba(26,179,148,1)",
                  data: [28, 48, 40, 19, 86, 27, 90]
                }
              ]
            };
            const lineOptions = {
              scaleShowGridLines: true,
              scaleGridLineColor: "rgba(0,0,0,.05)",
              scaleGridLineWidth: 1,
              bezierCurve: true,
              bezierCurveTension: 0.4,
              pointDot: true,
              pointDotRadius: 4,
              pointDotStrokeWidth: 1,
              pointHitDetectionRadius: 20,
              datasetStroke: true,
              datasetStrokeWidth: 2,
              datasetFill: true,
              responsive: true,
            };
            const ctx = document.getElementById("lineChart").getContext("2d");
            const myNewChart = new Chart(ctx).Line(lineData, lineOptions);

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
      const {basic, headline, contact, summary, picture, about, organizations} = publicInfo;

      const basicContent = [
        {
          label: capitalize(headline.title),
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
          label: '',
          value: about.aboutMe
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
              imageUrl={picture.imageUrl}
              name={capitalize(basic.name)}
            />
            <div className="wrapper wrapper-content">
              <div className="row">
                <div className="ibox float-e-margins">
                  <div className="col-xs-10 col-xs-offset-1 no-padding">
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
                  <div className="col-xs-4 col-xs-offset-1 no-padding">
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
                            classGridLabel='col-xs-12'
                            classGridValue='col-xs-0'
                          />

                          {(contact.phone || contact.email) && (
                            <IboxContentHorizontal
                              ibcTitle="Contact"
                              ibcContent={contactContent}
                              classGridLabel='col-xs-4'
                              classGridValue='col-xs-8'
                            />
                          )}
                          {(summary.noOrg || summary.noEmployees || summary.noFeedbacks) && (
                            <IboxContentInline
                              ibcTitle="Summary"
                              ibcContent={summaryContent}
                              classGrid="col-xs-4"
                            />
                          )}
                          {about.aboutMe && (
                            <IboxContentHorizontal
                              ibcTitle='About'
                              ibcContent={aboutContent}
                              classGridLabel='col-xs-0'
                              classGridValue='col-xs-12'
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xs-6 no-padding">
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
                            classGrid="col-xs-3"
                          />
                          <IboxContentInline
                            ibcContent={metricsContent[1]}
                            classGrid="col-xs-3"
                          />
                          <IboxContentInline
                            ibcContent={metricsContent[2]}
                            classGrid="col-xs-3"
                          />
                        </div>
                      </div>
                      {!_.isEmpty(organizations) && (
                        <div className="row">
                          <div className="ibox float-e-margins">
                            <div className="ibox-title">
                              <h5>Organizations</h5>
                            </div>
                            {organizations.map(org => {
                              return (
                                <IboxContentOrganization
                                  key={org._id}
                                  title="Head of Engineering"
                                  name={org.name}
                                  startTime={new moment(org.startTime).format('MMMM YYYY')}
                                  endTime={new moment(org.endTime).format('MMMM YYYY')}
                                  noEmployees={org.employees.length}
                                  overallPercent="60%"
                                  imageUrl='/img/icare_benefits.png'
                                />)
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer gray-bg">
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