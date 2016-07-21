import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Mongo} from 'meteor/mongo';

// collection
import {Configs} from '/imports/api/users/index';

// methods
import {updateConfig} from '/imports/api/users/methods';
import * as Notifications from '/imports/api/notifications/methods';
import {getPublicData}  from '/imports/api/profiles/methods';

// components
import CheckBox from '/imports/ui/components/CheckBox1';
import Spinner from '/imports/ui/common/Spinner';

// containers
import ProfileDetail from '/imports/ui/components/ProfileDetail';
import LeadershipProgress from '/imports/ui/components/LeadershipProgress';

class ConfigProfile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      profile: null,
      metrics: null,
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
    if (!_.isEqual(prevProps.configs, this.props.configs)) {
      this.setState({
        loading: false,
        profile: this.props.configs.configs.profile,
        metrics: this.props.configs.configs.metrics
      });
    }
  }

  onSave() {
    const
      name = 'publicInfo',
      configs = {
        profile: this.state.profile,
        metrics: this.state.metrics
      };
    console.log(configs);
    updateConfig.call({name, configs}, (error) => {
      if (_.isEmpty(error)) {
        const
          closeButton = false,
          title = 'Customize public information',
          message = 'Saved';
        Notifications.success.call({closeButton, title, message});
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
    const {loading, profile, metrics, publicData} = this.state;
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
              <ProfileDetail
                profile={publicData.profile}
                profileClass="row"
              />
            </div>
            <div className="col-md-3">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Configure your public information</h5>
                </div>
                <div className="ibox-content">
                  <form
                    method="get"
                    className="form-horizontal"
                    onSubmit={(e) => {
                    // e.preventDefault();
                    this.onSave();
                  }}>
                    <div className="form-group" style={{margin: 0}}>
                      <label className="control-label">Profile</label>
                      <CheckBox
                        label=" Name"
                        checked={profile.name}
                        onChange={value => this.setState({ profile: { ...profile, name: value } })}
                        disabled={true}
                      />
                      <CheckBox
                        label=" Current Organization"
                        checked={profile.orgName}
                        onChange={value => this.setState({ profile: { ...profile, orgName: value } })}
                      />
                      <CheckBox
                        label=" Industry"
                        checked={profile.industry}
                        onChange={value => this.setState({ profile: { ...profile, industry: value } })}
                      />
                      <CheckBox
                        label=" Phone number"
                        checked={profile.phoneNumber}
                        onChange={value => this.setState({ profile: { ...profile, phoneNumber: value } })}
                      />
                      <CheckBox
                        label=" About me"
                        checked={profile.aboutMe}
                        onChange={value => this.setState({ profile: { ...profile, aboutMe: value } })}
                      />
                      <CheckBox
                        label=" Picture"
                        checked={profile.picture}
                        onChange={value => this.setState({ profile: { ...profile, picture: value } })}
                      />
                      <CheckBox
                        label=" Number of Organizations"
                        checked={profile.noOrg}
                        onChange={value => this.setState({ profile: { ...profile, noOrg: value } })}
                      />
                      <CheckBox
                        label=" Number of Employees"
                        checked={profile.noEmployees}
                        onChange={value => this.setState({ profile: { ...profile, noEmployees: value } })}
                      />
                      <CheckBox
                        label=" Number of Feedbacks"
                        checked={profile.noFeedbacks}
                        onChange={value => this.setState({ profile: { ...profile, noFeedbacks: value } })}
                      />
                    </div>
                    <div className="hr-line-dashed"></div>
                    <div className="form-group" style={{margin: 0}}>
                      <label className="control-label">Metrics</label>
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

export default ConfigProfileContainer = createContainer(({params}) => {
  // subscribe
  const subConfig = Meteor.subscribe('configs', {name: 'publicInfo'});

  // loading
  const loading = !subConfig.ready() && (Configs.find({}).count() < 1);

  // check exists
  const configs = Configs.findOne({});
  const configExists = !loading;

  return {
    loading,
    configs: configExists ? configs : {}
  };
}, ConfigProfile);