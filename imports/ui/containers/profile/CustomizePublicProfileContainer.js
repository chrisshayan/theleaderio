import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {words as capitalize} from 'capitalize';

// collections
import {Preferences} from '/imports/api/users/index';

// constants
import {DEFAULT_PUBLIC_INFO_PREFERENCES} from '/imports/utils/defaults';

// methods
import {getPublicData}  from '/imports/api/profiles/methods';
import {updatePreferences} from '/imports/api/users/methods';
import * as Notifications from '/imports/api/notifications/methods';

// components
import Spinner from '/imports/ui/common/Spinner';
import CheckBox from '/imports/ui/components/CheckBox1';

import ProfileInformationBox from '/imports/ui/components/ProfileInformationBox';
import ProfileMetricsBox from '/imports/ui/components/ProfileMetricsBox';
import IboxContentOrganization from '/imports/ui/components/IboxContentOrganization';

class ProfilePreferences extends Component {

  constructor() {
    super();

    this.state = {
      loading: null,
      publicInfo: {},
      preferences: DEFAULT_PUBLIC_INFO_PREFERENCES
    };
  }

  componentWillMount() {
    this.setState({
      loading: true
    });
    const alias = Session.get('alias');
    getPublicData.call({alias, isGetAll: true}, (error, result) => {
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
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEmpty(nextProps.preferences)) {
      this.setState({
        preferences: nextProps.preferences
      });
    }
  }
  

  onSave() {
    const
      name = 'publicInfo',
      preferences = this.state.preferences;
    updatePreferences.call({name, preferences}, (error) => {
      if (_.isEmpty(error)) {
        const
          closeButton = false,
          title = 'Customize public profile',
          message = 'Saved';
        Notifications.success.call({closeButton, title, message});
      } else {
        const
          closeButton = false,
          title = 'Customize public profile',
          message = error.reason;
        Notifications.error.call({closeButton, title, message});
      }
    });
  }

  render() {
    const loading = (this.props.loading | this.state.loading);

    if (!loading) {
      const {preferences} = this.state;
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
      } = this.state.publicInfo;
      
      const ulStyle = {margin: 0, paddingLeft: 15};

      return (
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="row">
            <div className="col-md-4">
              <ProfileInformationBox
                preferences={preferences}
                data={{basic, headline, contact, summary, picture, about}}
              />
            </div>
            <div className="col-md-5">
              <div className="ibox-content no-padding">
                <div className="row">
                  <ProfileMetricsBox
                    isPresent={organizations[0].isPresent}
                    label="Half-year leadership progress"
                    preferences={preferences.metrics}
                    data={{chart, metrics}}
                  />
                </div>
                {(!_.isEmpty(organizations) && preferences.organizations.show) && (
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
                              startTime: new moment(org.startTime).format('MMMM YYYY'),
                              endTime: new moment(org.endTime).format('MMMM YYYY'),
                              noEmployees: org.employees.length
                            }}
                            imageClass="col-md-4"
                            dataClass="col-md-8"
                            imageUrl={org.imageUrl}
                          />)
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-3 pull-right">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Customize your public profile</h5>
                </div>
                <div className="ibox-content">
                  <form
                    method="get"
                    className="form-horizontal"
                    onSubmit={(e) => {
                    e.preventDefault();
                    this.onSave();
                  }}>
                    <div className="form-group" style={{margin: 0}}>
                      <label className="control-label">Information</label>
                      <CheckBox
                        label=" Basics"
                        checked={true}
                        disabled={true}
                      />
                      <CheckBox
                        label=" Picture"
                        checked={preferences.picture.imageUrl}
                        onChange={value => this.setState({ preferences: {...preferences, picture: { ...preferences.picture, imageUrl: value }} })}
                      />
                      <CheckBox
                        label=" Headline"
                        checked={preferences.headline.title}
                        onChange={value => this.setState({ preferences: {...preferences, headline: { ...preferences.headline, title: value }} })}
                      />
                      <CheckBox
                        label=" Contact"
                        checked={preferences.contact.email | preferences.contact.phone}
                        onChange={value => this.setState({ preferences: {...preferences, contact: { email: value, phone: value }} })}
                      />
                      <ul className="unstyled" style={ulStyle}>
                        <li>
                          <CheckBox
                            label=" Email"
                            checked={preferences.contact.email}
                            onChange={value => this.setState({ preferences: {...preferences, contact: { ...preferences.contact, email: value }} })}
                          />
                        </li>
                        <li>
                          <CheckBox
                            label=" Phone"
                            checked={preferences.contact.phone}
                            onChange={value => this.setState({ preferences: {...preferences, contact: { ...preferences.contact, phone: value }} })}
                          />
                        </li>
                      </ul>
                      <CheckBox
                        label=" Summary"
                        checked={preferences.summary.noOrg | preferences.summary.noEmployees | preferences.summary.noFeedbacks}
                        onChange={value => this.setState({ preferences: {...preferences, summary: { noOrg: value, noEmployees: value, noFeedbacks: value }} })}
                      />
                      <ul className="unstyled" style={ulStyle}>
                        <li>
                          <CheckBox
                            label=" Number of Organizations"
                            checked={preferences.summary.noOrg}
                            onChange={value => this.setState({ preferences: {...preferences, summary: { ...preferences.summary, noOrg: value }} })}
                          />
                        </li>
                        <li>
                          <CheckBox
                            label=" Number of Employees"
                            checked={preferences.summary.noEmployees}
                            onChange={value => this.setState({ preferences: {...preferences, summary: { ...preferences.summary, noEmployees: value }} })}
                          />
                        </li>
                        <li>
                          <CheckBox
                            label=" Number of Feedbacks"
                            checked={preferences.summary.noFeedbacks}
                            onChange={value => this.setState({ preferences: {...preferences, summary: { ...preferences.summary, noFeedbacks: value }} })}
                          />
                        </li>
                      </ul>
                      <CheckBox
                        label=" About"
                        checked={preferences.about.aboutMe}
                        onChange={value => this.setState({ preferences: {...preferences, about: { ...preferences.about, aboutMe: value }} })}
                      />
                    </div>

                    <div className="hr-line-dashed" style={{marginTop: 10, marginBottom: 5}}></div>

                    <div className="form-group" style={{margin: 0}}>
                      <label className="control-label">Metrics</label>
                      <CheckBox
                        label=" All"
                        checked={
                          preferences.metrics.purpose |
                          preferences.metrics.mettings |
                          preferences.metrics.rules |
                          preferences.metrics.communications |
                          preferences.metrics.leadership |
                          preferences.metrics.workload |
                          preferences.metrics.energy |
                          preferences.metrics.stress |
                          preferences.metrics.decision |
                          preferences.metrics.respect |
                          preferences.metrics.conflict
                        }
                        onChange={value => this.setState({ preferences: {
                          ...preferences,
                          metrics: {
                            overall: true,
                            purpose: value,
                            mettings: value,
                            rules: value,
                            communications: value,
                            leadership: value,
                            workload: value,
                            energy: value,
                            stress: value,
                            decision: value,
                            respect: value,
                            conflict: value
                          }
                        }})}
                      />
                      <ul className="unstyled" style={ulStyle}>
                        <li>
                          <CheckBox
                            label=" Overall"
                            checked={true}
                            disabled={true}
                          />
                        </li>
                        <li>
                          <CheckBox
                            label=" Purpose"
                            checked={preferences.metrics.purpose}
                            onChange={value => this.setState({ preferences: {...preferences, metrics: { ...preferences.metrics, purpose: value }} })}
                          />
                        </li>
                        <li>
                          <CheckBox
                            label=" Mettings"
                            checked={preferences.metrics.mettings}
                            onChange={value => this.setState({ preferences: {...preferences, metrics: { ...preferences.metrics, mettings: value }} })}
                          />
                        </li>
                        <li>
                          <CheckBox
                            label=" Rules"
                            checked={preferences.metrics.rules}
                            onChange={value => this.setState({ preferences: {...preferences, metrics: { ...preferences.metrics, rules: value }} })}
                          />
                        </li>
                        <li>
                          <CheckBox
                            label=" Communications"
                            checked={preferences.metrics.communications}
                            onChange={value => this.setState({ preferences: {...preferences, metrics: { ...preferences.metrics, communications: value }} })}
                          />
                        </li>
                        <li>
                          <CheckBox
                            label=" Leadership"
                            checked={preferences.metrics.leadership}
                            onChange={value => this.setState({ preferences: {...preferences, metrics: { ...preferences.metrics, leadership: value }} })}
                          />
                        </li>
                        <li>
                          <CheckBox
                            label=" Workload"
                            checked={preferences.metrics.workload}
                            onChange={value => this.setState({ preferences: {...preferences, metrics: { ...preferences.metrics, workload: value }} })}
                          />
                        </li>
                        <li>
                          <CheckBox
                            label=" Energy"
                            checked={preferences.metrics.energy}
                            onChange={value => this.setState({ preferences: {...preferences, metrics: { ...preferences.metrics, energy: value }} })}
                          />
                        </li>
                        <li>
                          <CheckBox
                            label=" Stress"
                            checked={preferences.metrics.stress}
                            onChange={value => this.setState({ preferences: {...preferences, metrics: { ...preferences.metrics, stress: value }} })}
                          />
                        </li>
                        <li>
                          <CheckBox
                            label=" Decision"
                            checked={preferences.metrics.decision}
                            onChange={value => this.setState({ preferences: {...preferences, metrics: { ...preferences.metrics, decision: value }} })}
                          />
                        </li>
                        <li>
                          <CheckBox
                            label=" Respect"
                            checked={preferences.metrics.respect}
                            onChange={value => this.setState({ preferences: {...preferences, metrics: { ...preferences.metrics, respect: value }} })}
                          />
                        </li>
                        <li>
                          <CheckBox
                            label=" Conflict"
                            checked={preferences.metrics.conflict}
                            onChange={value => this.setState({ preferences: {...preferences, metrics: { ...preferences.metrics, conflict: value }} })}
                          />
                        </li>
                      </ul>
                      {organizations.length > 0 && (
                        <CheckBox
                          label=" Organizations"
                          checked={preferences.organizations.show}
                          onChange={value => this.setState({ preferences: {...preferences, organizations: { ...preferences.organizations, show: value }} })}
                        />
                      )}
                    </div>
                    <div className="hr-line-dashed"></div>
                    <div className="form-group" style={{margin: 0}}>
                      <button className="btn btn-primary" type="submit">Save changes</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
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

export default ProfilePreferencesContainer = createContainer((params) => {
  // subscribe
  const subPreferences = Meteor.subscribe('preferences', {name: 'publicInfo'});

  // loading
  const loading = !subPreferences.ready() && (Preferences.find({}).count() < 1);

  // check exists
  const preferences = Preferences.findOne({});
  const preferencesExists = !loading;

  return {
    loading,
    preferences: preferencesExists ? preferences.preferences : {}
  };
}, ProfilePreferences);