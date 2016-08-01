import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Mongo} from 'meteor/mongo';

// collection
import {Preferences} from '/imports/api/users/index';

// methods
import {updatePreferences} from '/imports/api/users/methods';
import * as Notifications from '/imports/api/notifications/methods';
import {getPublicData}  from '/imports/api/profiles/methods';

// components
import CheckBox from '/imports/ui/components/CheckBox1';
import Spinner from '/imports/ui/common/Spinner';

import ProfileDetail from '/imports/ui/components/ProfileDetail';
import LeadershipProgress from '/imports/ui/components/LeadershipProgress';

class PreferencesProfile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      basic: null,
      contact: null,
      summary: null,
      about: null,
      picture: null,
      metrics: null,
      allMetrics: null,
      publicData: null
    };
  }


  componentWillMount() {
    const alias = Session.get('alias');
    getPublicData.call({alias}, (error, result) => {
      if (_.isEmpty(error)) {
        this.setState({
          publicData: result
        });
      }
    });
  }


  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.preferences, this.props.preferences)) {
      this.setState({
        loading: false,
        basic: this.props.preferences.preferences.basic,
        contact: this.props.preferences.preferences.contact,
        summary: this.props.preferences.preferences.summary,
        about: this.props.preferences.preferences.about,
        picture: this.props.preferences.preferences.picture,
        metrics: this.props.preferences.preferences.metrics
      });
    }
  }

  onSave() {
    const
      name = 'publicInfo',
      configs = {
        basic: this.state.basic,
        contact: this.state.contact,
        summary: this.state.summary,
        about: this.state.about,
        picture: this.state.picture,
        metrics: this.state.metrics
      };
    updatePreferences.call({name, preferences}, (error) => {
      if (_.isEmpty(error)) {
        const
          closeButton = false,
          title = 'Customize public information',
          message = 'Saved';
        Notifications.success.call({closeButton, title, message});
        const alias = Session.get('alias');
        getPublicData.call({alias}, (error, result) => {
          if (_.isEmpty(error)) {
            this.setState({
              publicData: result
            });
          }
        });
      } else {
        const
          closeButton = false,
          title = 'Customize public information',
          message = error.reason;
        Notifications.error.call({closeButton, title, message});
      }
    });
  }

  render() {
    const {
      loading,
      basic,
      contact,
      summary,
      picture,
      about,
      metrics,
      allMetrics,
      publicData
    } = this.state;
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
            <div className="col-md-4">
            </div>
            <div className="col-md-3">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Customize public information</h5>
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
                      <label className="control-label">Profile</label>
                      <CheckBox
                        label=" Basic"
                        checked={basic.name}
                        onChange={value => this.setState({ basic: { ...basic, name: value } })}
                        disabled={true}
                      />
                      <CheckBox
                        label=" Headline"
                        checked={basic.industry}
                        onChange={value => this.setState({ basic: { ...basic, industry: value } })}
                      />
                      <CheckBox
                        label=" Contact"
                        checked={contact.phone}
                        onChange={value => this.setState({ contact: { ...contact, phone: value } })}
                      />
                      <CheckBox
                        label=" Summary"
                        checked={about.aboutMe}
                        onChange={value => this.setState({ about: { ...about, aboutMe: value } })}
                      />
                      <CheckBox
                        label=" Picture"
                        checked={picture.imageUrl}
                        onChange={value => this.setState({ picture: { ...picture, imageUrl: value } })}
                      />
                      <CheckBox
                        label=" About"
                        checked={summary.noOrg}
                        onChange={value => this.setState({ summary: { ...summary, noOrg: value } })}
                      />
                      <CheckBox
                        label=" Organizations"
                        checked={summary.noEmployees}
                        onChange={value => this.setState({ summary: { ...summary, noEmployees: value } })}
                      />
                    </div>
                    <div className="hr-line-dashed" style={{marginTop: 10, marginBottom: 5}}></div>
                    <div className="form-group" style={{margin: 0}}>
                      <label className="control-label">Metrics</label>
                      <CheckBox
                        label=" All"
                        checked={allMetrics}
                        onChange={value =>
                          this.setState({ metrics: {
                            overall: value,
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
                        }})}
                      />
                      <CheckBox
                        label=" Overall"
                        checked={metrics.overall}
                        onChange={value => this.setState({ metrics: { ...metrics, overall: value } })}
                      />
                      <CheckBox
                        label=" Purpose"
                        checked={metrics.purpose}
                        onChange={value => this.setState({ metrics: { ...metrics, purpose: value } })}
                      />
                      <CheckBox
                        label=" Mettings"
                        checked={metrics.mettings}
                        onChange={value => this.setState({ metrics: { ...metrics, mettings: value } })}
                      />
                      <CheckBox
                        label=" Rules"
                        checked={metrics.rules}
                        onChange={value => this.setState({ metrics: { ...metrics, rules: value } })}
                      />
                      <CheckBox
                        label=" Communications"
                        checked={metrics.communications}
                        onChange={value => this.setState({ metrics: { ...metrics, communications: value } })}
                      />
                      <CheckBox
                        label=" Leadership"
                        checked={metrics.leadership}
                        onChange={value => this.setState({ metrics: { ...metrics, leadership: value } })}
                      />
                      <CheckBox
                        label=" Workload"
                        checked={metrics.workload}
                        onChange={value => this.setState({ metrics: { ...metrics, workload: value } })}
                      />
                      <CheckBox
                        label=" Energy"
                        checked={metrics.energy}
                        onChange={value => this.setState({ metrics: { ...metrics, energy: value } })}
                      />
                      <CheckBox
                        label=" Stress"
                        checked={metrics.stress}
                        onChange={value => this.setState({ metrics: { ...metrics, stress: value } })}
                      />
                      <CheckBox
                        label=" Decision"
                        checked={metrics.decision}
                        onChange={value => this.setState({ metrics: { ...metrics, decision: value } })}
                      />
                      <CheckBox
                        label=" Respect"
                        checked={metrics.respect}
                        onChange={value => this.setState({ metrics: { ...metrics, respect: value } })}
                      />
                      <CheckBox
                        label=" Conflict"
                        checked={metrics.conflict}
                        onChange={value => this.setState({ metrics: { ...metrics, conflict: value } })}
                      />
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
    }
  }
}

export default PreferencesProfileContainer = createContainer(({params}) => {
  // subscribe
  const subPreferences = Meteor.subscribe('preferences', {name: 'publicInfo'});
  
  // get public info
  const alias = Session.get('alias');
  getPublicData.call({alias}, (error, result) => {
    if (_.isEmpty(error)) {
      // this.setState({
      //   loading: false,
      //   publicInfo: result,
      //   chartLabel: result.chart.label,
      //   chartData: result.chart.overall
      // });

    } else {
      // this.setState({
      //   loading: false,
      //   errors: error.reason
      // });
    }
  });
  
  // loading
  const loading = !subPreferences.ready() && (Preferences.find({}).count() < 1);

  // check exists
  const preferences = Preferences.findOne({});
  const preferencesExists = !loading;

  return {
    loading,
    preferences: preferencesExists ? preferences : {}
  };
}, PreferencesProfile);