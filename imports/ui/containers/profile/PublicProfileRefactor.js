import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {words as capitalize} from 'capitalize';
import moment from 'moment';
import {LinkedinButton, FacebookButton, TwitterTweetButton} from 'react-social-sharebuttons';

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
import IboxContentOrganization from '/imports/ui/components/IboxContentOrganization';
import LineChart from '/imports/ui/components/LineChart';
import Chosen from '/imports/ui/components/Chosen';


export default class PublicProfile extends Component {
  constructor() {
    super();

    this.state = {
      loading: null,
      alias: null,
      publicInfo: null,
      chartLabel: null,
      chartData: null
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
              publicInfo: result,
              chartLabel: result.chart.label,
              chartData: result.chart.overall
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

  onChooseMetric(selected) {
    if (selected === 'overall') {
      this.setState({chartData: this.state.publicInfo.chart.overall});
    }
    if (selected === 'purpose') {
      this.setState({chartData: this.state.publicInfo.chart.purpose});
    }
    if (selected === 'mettings') {
      this.setState({chartData: this.state.publicInfo.chart.mettings});
    }
    if (selected === 'rules') {
      this.setState({chartData: this.state.publicInfo.chart.rules});
    }
    if (selected === 'communications') {
      this.setState({chartData: this.state.publicInfo.chart.communications});
    }
    if (selected === 'leadership') {
      this.setState({chartData: this.state.publicInfo.chart.leadership});
    }
    if (selected === 'workload') {
      this.setState({chartData: this.state.publicInfo.chart.workload});
    }
    if (selected === 'energy') {
      this.setState({chartData: this.state.publicInfo.chart.energy});
    }
    if (selected === 'stress') {
      this.setState({chartData: this.state.publicInfo.chart.stress});
    }
    if (selected === 'decision') {
      this.setState({chartData: this.state.publicInfo.chart.decision});
    }
    if (selected === 'respect') {
      this.setState({chartData: this.state.publicInfo.chart.respect});
    }
    if (selected === 'conflict') {
      this.setState({chartData: this.state.publicInfo.chart.conflict});
    }
  }

  shareOn() {
    console.log(`share on Linkedin`)
    console.log(this.refs.shareLinkedin.value)
  }

  render() {
    const {publicInfo, loading, alias} = this.state;
    // console.log(this.state.chartData)

    if (loading) {
      return (
        <div>
          <Spinner />
        </div>
      );
    }
    if (alias) {
      const url = "http://jackiekhuu.devtheleader.io:9000/";

      const {
        basic,
        headline,
        contact,
        summary,
        picture,
        about,
        organizations,
        metrics
      } = publicInfo;

      // content for basic info
      const basicContent = [];
      if (!!headline.title) {
        basicContent.push({label: capitalize(headline.title), value: ''});
      }
      if (!!basic.industry) {
        basicContent.push({label: basic.industry, value: ''});
      }

      // content for contact info
      const contactContent = [];
      if (!!contact.email) {
        contactContent.push({label: 'Email', value: contact.email});
      }
      if (!!contact.phone) {
        contactContent.push({label: 'Phone', value: contact.phone});
      }

      // content for summary info
      const summaryContent = {};
      if (!!summary.noOrg) {
        summaryContent.Organizations = summary.noOrg;
      }
      if (!!summary.noEmployees) {
        summaryContent.Employees = summary.noEmployees;
      }
      if (!!summary.noFeedbacks) {
        summaryContent.Feedbacks = summary.noFeedbacks;
      }

      // content for about info
      const aboutContent = [];
      if (!!about.aboutMe) {
        aboutContent.push({label: '', value: about.aboutMe});
      }

      // metrics chart
      const {chartLabel, chartData} = this.state;
      const metricOptions = [];
      $.map(metrics, (value, key) => {
        metricOptions.push(key);
      });

      // content for metrics info
      const metricsContent = [];
      const group1 = {};
      const group2 = {};
      const group3 = {};
      if (!!metrics.overall) {
        group1.Overall = metrics.overall;
      }
      if (!!metrics.purpose) {
        group1.Purpose = metrics.purpose;
      }
      if (!!metrics.mettings) {
        group1.Mettings = metrics.mettings;
      }
      if (!!metrics.rules) {
        group1.Rules = metrics.rules;
      }
      if (!!metrics.communications) {
        group2.Communications = metrics.communications;
      }
      if (!!metrics.leadership) {
        group2.Leadership = metrics.leadership;
      }
      if (!!metrics.workload) {
        group2.Workload = metrics.workload;
      }
      if (!!metrics.energy) {
        group2.Energy = metrics.energy;
      }
      if (!!metrics.stress) {
        group3.Stress = metrics.stress;
      }
      if (!!metrics.decision) {
        group3.Decision = metrics.decision;
      }
      if (!!metrics.respect) {
        group3.Respect = metrics.respect;
      }
      if (!!metrics.conflict) {
        group3.Conflict = metrics.conflict;
      }
      if (!_.isEmpty(group1)) {
        metricsContent.push(group1);
      }
      if (!_.isEmpty(group2)) {
        metricsContent.push(group2);
      }
      if (!_.isEmpty(group3)) {
        metricsContent.push(group3);
      }


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
                          <span className="text-navy"><i className="fa fa-share"></i></span>
                        </li>
                        <li>
                          <a
                            ref="shareLinkedin"
                            className="btn btn-xs btn-primary"
                            onClick={this.shareOn.bind(this)}
                          >
                            <i className="fa fa-linkedin"></i>
                          </a>
                        </li>
                        <li>
                          <a
                            ref="shareTwitter"
                            className="btn btn-xs btn-primary"
                            onClick={this.shareOn.bind(this)}
                          >
                            <i className="fa fa-twitter"></i>
                          </a>
                        </li>
                        <li>
                          <a
                            ref="shareFacebook"
                            className="btn btn-xs btn-primary"
                            onClick={this.shareOn.bind(this)}
                          >
                            <i className="fa fa-facebook"></i>
                          </a>
                        </li>
                        <li>
                          <LinkedinButton url={url}/>
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

                          {!_.isEmpty(contactContent) && (
                            <IboxContentHorizontal
                              ibcTitle="Contact"
                              ibcContent={contactContent}
                              classGridLabel='col-xs-4'
                              classGridValue='col-xs-8'
                            />
                          )}
                          {!_.isEmpty(summaryContent) && (
                            <IboxContentInline
                              ibcTitle="Summary"
                              ibcContent={summaryContent}
                              classGrid="col-xs-4"
                            />
                          )}
                          {!_.isEmpty(aboutContent) && (
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
                            <h5>Leadership progress (no real data)</h5>
                          </div>
                          <div className="ibox-content">
                            <h5><strong>Half-year Metric Progress Chart</strong></h5>
                            <Chosen
                              ref="chosenMetric"
                              options={metricOptions}
                              selectedOptions={null}
                              chosenClass="chosen-select"
                              isMultiple={false}
                              placeHolder='Choose one option ...'
                              onChange={this.onChooseMetric.bind(this)}
                            />
                            <LineChart
                              label={chartLabel}
                              data={chartData}
                            />
                          </div>
                          {metricsContent.map((content, key) => (
                            <IboxContentInline
                              key={key}
                              ibcContent={content}
                              classGrid="col-xs-3"
                            />
                          ))}
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