import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

// collections
import {Preferences} from '/imports/api/users/index';

// methods
import {verify as verifyAlias} from '/imports/api/users/methods';
import {getPublicData}  from '/imports/api/profiles/methods';

// components
import Spinner from '/imports/ui/common/Spinner';
import CheckBox from '/imports/ui/components/CheckBox1';

import ProfileDetail from '/imports/ui/components/ProfileDetail';
import LeadershipProgress from '/imports/ui/components/LeadershipProgress';
import IboxContentOrganization from '/imports/ui/components/IboxContentOrganization';

class ProfilePreferences extends Component {

  constructor() {
    super();

    this.state = {
      loading: null,
      publicInfo: {},
      chartLabel: null,
      chartData: null
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
  }

  render() {
    const loading = (this.props.loading | this.state.loading);

    if (!loading) {
      const {preferences} = this.props;
      const {
        publicInfo,
        chartLabel,
        chartData
      } = this.state;
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
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="row">
            <div className="col-md-8">
              <ProfileDetail
                profile={{ basic, headline, contact, summary, picture, about }}
              />
              <LeadershipProgress
                label="Leadership progress (no real data)"
                chart={chart}
                metrics={metrics}
              />
              {!_.isEmpty(organizations) && (
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
              )}
            </div>
            <div className="col-md-4 pull-right">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Customize</h5>
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
                        checked={preferences.basic.name}
                        onChange={value => this.setState({  })}
                        disabled={true}
                      />
                      <CheckBox
                        label=" Headline"
                        checked={preferences.basic.industry}
                        onChange={value => this.setState({  })}
                      />
                      <CheckBox
                        label=" Contact"
                        checked={preferences.contact.phone}
                        onChange={value => this.setState({  })}
                      />
                      <CheckBox
                        label=" Summary"
                        checked={preferences.about.aboutMe}
                        onChange={value => this.setState({  })}
                      />
                      <CheckBox
                        label=" Picture"
                        checked={preferences.picture.imageUrl}
                        onChange={value => this.setState({  })}
                      />
                      <CheckBox
                        label=" About"
                        checked={preferences.summary.noOrg}
                        onChange={value => this.setState({  })}
                      />
                      <CheckBox
                        label=" Organizations"
                        checked={preferences.summary.noEmployees}
                        onChange={value => this.setState({ })}
                      />
                    </div>
                    <div className="hr-line-dashed" style={{marginTop: 10, marginBottom: 5}}></div>
                    <div className="form-group" style={{margin: 0}}>
                      <label className="control-label">Metrics</label>
                      <CheckBox
                        label=" Overall"
                        checked={preferences.metrics.overall}
                        onChange={value => this.setState({ })}
                      />
                      <CheckBox
                        label=" Purpose"
                        checked={preferences.metrics.purpose}
                        onChange={value => this.setState({  })}
                      />
                      <CheckBox
                        label=" Mettings"
                        checked={preferences.metrics.mettings}
                        onChange={value => this.setState({  })}
                      />
                      <CheckBox
                        label=" Rules"
                        checked={preferences.metrics.rules}
                        onChange={value => this.setState({  })}
                      />
                      <CheckBox
                        label=" Communications"
                        checked={preferences.metrics.communications}
                        onChange={value => this.setState({  })}
                      />
                      <CheckBox
                        label=" Leadership"
                        checked={preferences.metrics.leadership}
                        onChange={value => this.setState({  })}
                      />
                      <CheckBox
                        label=" Workload"
                        checked={preferences.metrics.workload}
                        onChange={value => this.setState({  })}
                      />
                      <CheckBox
                        label=" Energy"
                        checked={preferences.metrics.energy}
                        onChange={value => this.setState({  })}
                      />
                      <CheckBox
                        label=" Stress"
                        checked={preferences.metrics.stress}
                        onChange={value => this.setState({ })}
                      />
                      <CheckBox
                        label=" Decision"
                        checked={preferences.metrics.decision}
                        onChange={value => this.setState({ })}
                      />
                      <CheckBox
                        label=" Respect"
                        checked={preferences.metrics.respect}
                        onChange={value => this.setState({  })}
                      />
                      <CheckBox
                        label=" Conflict"
                        checked={preferences.metrics.conflict}
                        onChange={value => this.setState({  })}
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