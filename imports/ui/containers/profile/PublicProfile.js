import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {words as capitalize} from 'capitalize';
import moment from 'moment';
import {LinkedinButton, TwitterTweetButton, FacebookButton} from 'react-social-sharebuttons';

// methods
import {getPublicData}  from '/imports/api/profiles/methods';
import {verify as verifyAlias} from '/imports/api/users/methods';

// components
import Spinner from '/imports/ui/common/Spinner';
import NoticeForm from '/imports/ui/common/NoticeForm';
import CopyRight from '/imports/ui/common/Copyright';
import TopNav from '/imports/ui/common/TopNav';

import ProfileDetail from '/imports/ui/components/ProfileDetail';
import LeadershipProgress from '/imports/ui/components/LeadershipProgress';
import IboxContentOrganization from '/imports/ui/components/IboxContentOrganization';


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
        getPublicData.call({alias, isGetAll: false}, (error, result) => {
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
      const url = document.location.href;

      const {
        basic,
        headline,
        contact,
        summary,
        picture,
        about,
        organizations,
        metrics,
        chart
      } = publicInfo;

      return (
        <div className="gray-bg">
          <div className="container gray-bg">
            <div className="row">
              <div className="col-md-10 col-md-offset-1 col-xs-12">
                <TopNav
                  imageUrl={picture.imageUrl}
                />
              </div>
            </div>

            <div className="row">
              <div className="ibox float-e-margins">
                <div className="col-md-10 col-md-offset-1 no-padding">
                  <div className="ibox-title">
                    <ul className="list-inline social-icon pull-right">
                      <li>
                        <LinkedinButton
                          url={url}
                        />
                      </li>
                      <li>
                        <TwitterTweetButton
                          url={url}
                        />
                      </li>
                    </ul>
                    <h5>Public Profile</h5>
                  </div>
                </div>
                <div className="col-md-7 col-md-offset-1 col-xs-12 no-padding">
                  <div className="ibox-content gray-bg">
                    <div className="row">
                      <ProfileDetail
                        profile={{ basic, headline, contact, summary, picture, about }}
                      />
                    </div>
                    <div className="row">
                      <LeadershipProgress
                        label="Leadership progress (no real data)"
                        chart={chart}
                        metrics={metrics}
                      />
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
            <div className="gray-bg">
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