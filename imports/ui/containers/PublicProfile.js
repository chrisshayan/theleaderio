import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
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

import ProfileInformationBox from '/imports/ui/components/ProfileInformationBox';
import ProfileMetricsBox from '/imports/ui/components/ProfileMetricsBox';
import IboxContentOrganization from '/imports/ui/components/IboxContentOrganization';

export default class PublicProfile extends Component {
  constructor() {
    super();

    this.state = {
      loading: null,
      alias: null,
      publicInfo: {},
      preferences: {}
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
              preferences: result.preferences
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
    const {loading, errors, alias} = this.state;

    if (loading) {
      return (
        <div>
          <Spinner />
        </div>
      );
    }
    if (alias) {
      const
        sharedUrl = document.location.href,
        sharedText = `Checkout my #leadership scorecard on`,
        {publicInfo, preferences} = this.state,
        {
        basic,
        headline,
        contact,
        summary,
        picture,
        about,
        organizations,
        metrics,
        chart
      } = publicInfo,
        isPresent = (organizations.length > 0) ? organizations[0].isPresent : false
        ;


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
                        <div className="addthis_inline_share_toolbox"></div>
                      </li>
                      <li>
                        <LinkedinButton
                          url={sharedUrl}
                        />
                      </li>
                      <li>
                        <TwitterTweetButton
                          url={sharedUrl}
                          text={sharedText}
                        />
                      </li>
                    </ul>
                    <h5>Public Profile</h5>
                  </div>
                </div>
                <div className="col-md-3 col-md-offset-1 col-xs-12 no-padding">
                  <div className="ibox-content gray-bg">
                    <div className="row">
                      <ProfileInformationBox
                        preferences={preferences}
                        data={{basic, headline, contact, summary, picture, about}}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-7 col-xs-12 no-padding">
                  <div className="ibox-content gray-bg">
                    <div className="row">
                      <ProfileMetricsBox
                        isPresent={isPresent}
                        label="Half-year leadership progress"
                        preferences={preferences.metrics}
                        data={{chart, metrics}}
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
                                data={{
                                  title: org.jobTitle,
                                  name: org.name,
                                  isPresent: org.isPresent,
                                  startTime: new moment(org.startTime).format('MMMM YYYY'),
                                  endTime: new moment(org.endTime).format('MMMM YYYY'),
                                  noEmployees: org.employees.length
                                }}
                                imageClass="col-md-3"
                                dataClass="col-md-8"
                                imageUrl={org.imageUrl}
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
          message={errors || "Alias doesn't exists"}
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