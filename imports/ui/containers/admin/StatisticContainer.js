import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

// collections
import {Accounts} from 'meteor/accounts-base';
import {Employees, STATUS_ACTIVE} from '/imports/api/employees/index';

// components
import Spinner from '/imports/ui/common/Spinner';
import LineChart from '/imports/ui/components/LineChart';
import Indicator from '/imports/ui/common/LoadingIndicator';
import Chosen from '/imports/ui/components/Chosen';
import IboxDashboard from '/imports/ui/components/IboxDashboard';

// methods
import {measureAdminStatistic} from '/imports/api/measures/methods';
import * as Notifications from '/imports/api/notifications/functions';

class StatisticComponent extends Component {
  constructor() {
    super();

    this.state = {
      errors: null,
      newCreationInterval: "LAST_WEEK",
      newCreationReady: false,
      newCreationStatistic: {
        ready: false,
        LAST_WEEK: {},
        LAST_2_WEEKS: {},
        LAST_MONTH: {},
        LAST_3_MONTHS: {}
      },
      emailSentInterval: "LAST_WEEK",
      emailSentReady: false,
      emailSentStatistic: {
        ready: false,
        LAST_WEEK: {},
        LAST_2_WEEKS: {},
        LAST_MONTH: {},
        LAST_3_MONTHS: {}
      },
      newCreationLabels: [],
      newCreationDataSets: [],
      emailSentLabels: [],
      emailToEmployeesDataSets: [],
      emailToLeadersDataSets: [],
      emailReferralsDataSets: [],
      emailRegistrationDataSets: [],
      emailSupportDataSets: [],
      dataSetsColors: [
        {
          fillColor: "rgba(26, 179, 148, 0.5)",
          strokeColor: "rgba(26, 179, 148, 0.7)",
          pointColor: "rgba(26, 179, 148, 1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(26, 179, 148, 1)",
        },
        {
          fillColor: "rgba(220, 220, 220, 0.5)",
          strokeColor: "rgba(220, 220, 220, 1)",
          pointColor: "rgba(220, 220, 220, 1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
        },
        {
          fillColor: "rgba(181, 184, 207, 0.5)",
          strokeColor: "rgba(181, 184, 207, 1)",
          pointColor: "rgba(181, 184, 207, 1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(181, 184, 207, 1)",
        },
        {
          fillColor: "rgba(228,240,251, 0.5)",
          strokeColor: "rgba(228,240,251, 1)",
          pointColor: "rgba(228,240,251, 1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(228,240,251, 1)",
        }
      ]
    };
  }

  componentDidMount() {
    const {newCreationInterval, emailSentInterval, dataSetsColors} = this.state;
    // new creation
    measureAdminStatistic.call({
      params: {
        type: "NEW_CREATION"
      }
    }, (error, newCreationStatistic) => {
      if (!error) {
        let newCreationDataSets = [];
        (!_.isEmpty(newCreationStatistic[newCreationInterval].data)) && (
          newCreationStatistic[newCreationInterval].data.map((dataset, key) => {
            newCreationDataSets.push({...dataSetsColors[key], data: dataset});
          })
        );
        this.setState({
          newCreationReady: true,
          newCreationStatistic,
          newCreationLabels: newCreationStatistic[newCreationInterval].labels,
          newCreationDataSets,
          errors: null
        });
      } else {
        this.setState({
          errors: error.reason
        });
      }
    });
    // emails sent
    measureAdminStatistic.call({
      params: {
        type: "EMAIL_SENT"
      }
    }, (error, emailSentStatistic) => {
      if (!error) {
        let
          emailToEmployeesDataSets = [],
          emailToLeadersDataSets = [],
          emailReferralsDataSets = [],
          emailRegistrationDataSets = [],
          emailSupportDataSets = []
        ;
        if (!_.isEmpty(emailSentStatistic[emailSentInterval].data)) {
          // to employees
          emailToEmployeesDataSets.push({...dataSetsColors[0], data: emailSentStatistic[emailSentInterval].data[0]});
          emailToEmployeesDataSets.push({...dataSetsColors[1], data: emailSentStatistic[emailSentInterval].data[1]});
          emailToEmployeesDataSets.push({...dataSetsColors[2], data: emailSentStatistic[emailSentInterval].data[2]});
          emailToEmployeesDataSets.push({...dataSetsColors[3], data: emailSentStatistic[emailSentInterval].data[3]});
          // to leaders
          emailToLeadersDataSets.push({...dataSetsColors[0], data: emailSentStatistic[emailSentInterval].data[4]});
          emailToLeadersDataSets.push({...dataSetsColors[1], data: emailSentStatistic[emailSentInterval].data[5]});
          // referrals
          emailReferralsDataSets.push({...dataSetsColors[0], data: emailSentStatistic[emailSentInterval].data[6]});
          // registration
          emailRegistrationDataSets.push({...dataSetsColors[0], data: emailSentStatistic[emailSentInterval].data[7]});
          // support
          emailSupportDataSets.push({...dataSetsColors[0], data: emailSentStatistic[emailSentInterval].data[8]});
          emailSupportDataSets.push({...dataSetsColors[1], data: emailSentStatistic[emailSentInterval].data[9]});
        }

        this.setState({
          emailSentReady: true,
          emailSentStatistic,
          emailSentLabels: emailSentStatistic[emailSentInterval].labels,
          emailToEmployeesDataSets,
          emailToLeadersDataSets,
          emailReferralsDataSets,
          emailRegistrationDataSets,
          emailSupportDataSets,
          errors: null
        });
      } else {
        this.setState({
          errors: error.reason
        });
      }
    });
  }

  onChooseNewCreationInterval(selected) {
    const {newCreationStatistic, dataSetsColors} = this.state;
    let newCreationDataSets = [];

    newCreationStatistic[selected].data.map((dataset, key) => {
      newCreationDataSets.push({...dataSetsColors[key], data: dataset});
    });
    this.setState({
      newCreationInterval: selected,
      newCreationLabels: newCreationStatistic[selected].labels,
      newCreationDataSets,
    });
  }

  onChooseEmailSentInterval(selected) {
    const {emailSentStatistic, dataSetsColors} = this.state;
    let
      emailToEmployeesDataSets = [],
      emailToLeadersDataSets = [],
      emailReferralsDataSets = [],
      emailRegistrationDataSets = [],
      emailSupportDataSets = []
      ;
    if (!_.isEmpty(emailSentStatistic[selected].data)) {
      // to employees
      emailToEmployeesDataSets.push({...dataSetsColors[0], data: emailSentStatistic[selected].data[0]});
      emailToEmployeesDataSets.push({...dataSetsColors[1], data: emailSentStatistic[selected].data[1]});
      emailToEmployeesDataSets.push({...dataSetsColors[2], data: emailSentStatistic[selected].data[2]});
      emailToEmployeesDataSets.push({...dataSetsColors[3], data: emailSentStatistic[selected].data[3]});
      // to leaders
      emailToLeadersDataSets.push({...dataSetsColors[0], data: emailSentStatistic[selected].data[4]});
      emailToLeadersDataSets.push({...dataSetsColors[1], data: emailSentStatistic[selected].data[5]});
      // referrals
      emailReferralsDataSets.push({...dataSetsColors[0], data: emailSentStatistic[selected].data[6]});
      // registration
      emailRegistrationDataSets.push({...dataSetsColors[0], data: emailSentStatistic[selected].data[7]});
      // support
      emailSupportDataSets.push({...dataSetsColors[0], data: emailSentStatistic[selected].data[8]});
      emailSupportDataSets.push({...dataSetsColors[1], data: emailSentStatistic[selected].data[9]});
    }
    this.setState({
      emailSentInterval: selected,
      emailSentLabels: emailSentStatistic[selected].labels,
      emailToEmployeesDataSets,
      emailToLeadersDataSets,
      emailReferralsDataSets,
      emailRegistrationDataSets,
      emailSupportDataSets,
    });
  }

  render() {
    const
      {
        errors,
        newCreationReady,
        emailSentReady,
        newCreationLabels,
        newCreationDataSets,
        emailSentLabels,
        emailToEmployeesDataSets,
        emailToLeadersDataSets,
        emailReferralsDataSets,
        emailRegistrationDataSets,
        emailSupportDataSets,
      } = this.state,
      {statisticReady, totalActiveUsers, totalActiveEmployees} = this.props,
      ready = newCreationReady || emailSentReady,
      chosenOptions = ["LAST_WEEK", "LAST_2_WEEKS", "LAST_MONTH", "LAST_3_MONTHS"]
      ;
    // console.log(this.state);

    if (ready) {
      return (
        <div>
          {statisticReady && (
            <div className="row">
              <div className="col-md-3">
                <IboxDashboard
                  interval="active"
                  label="Users"
                  content={totalActiveUsers}
                  description="have alias"
                />
              </div>
              <div className="col-md-3">
                <IboxDashboard
                  interval="active"
                  label="Employees"
                  content={totalActiveEmployees}
                  description=""
                />
              </div>
            </div>
          )}
          <div className="row">
            <div className="col-md-8">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <span className="pull-right">
                    <Chosen
                      options={chosenOptions}
                      defaultValue={chosenOptions[0]}
                      chosenClass="chosen-select pull-right"
                      isMultiple={false}
                      placeHolder='Choose one option ...'
                      onChange={this.onChooseNewCreationInterval.bind(this)}
                    />
                  </span>
                  <h3>New Creation</h3>
                </div>
                <div className="ibox-content">
                  {newCreationReady ? (
                    <LineChart
                      id="newCreation"
                      labels={newCreationLabels}
                      datasets={newCreationDataSets}
                    />
                  ) : (
                    <Indicator />
                  )}
                  <a className="btn btn-primary btn-bitbucket">
                  </a> Users
                  <br/>
                  <a className="btn btn-default btn-bitbucket"
                     style={{backgroundColor: '#DCDCDC', borderColor: '#DCDCDC', color: '#FFFFFF'}}>
                  </a> Organizations
                  <br/>
                  <a className="btn btn-default btn-bitbucket"
                     style={{backgroundColor: '#b5b8cf', borderColor: '#b5b8cf', color: '#FFFFFF'}}>
                  </a> Employees
                </div>
              </div>
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <span className="pull-right">
                    <Chosen
                      options={chosenOptions}
                      defaultValue={chosenOptions[0]}
                      chosenClass="chosen-select"
                      isMultiple={false}
                      placeHolder='Choose one option ...'
                      onChange={this.onChooseEmailSentInterval.bind(this)}
                    />
                  </span>
                  <h3>Emails sent</h3>
                </div>
                <div className="ibox-content">
                  <h4>To Employees</h4>
                  {emailSentReady ? (
                    <LineChart
                      id="toEmployees"
                      labels={emailSentLabels}
                      datasets={emailToEmployeesDataSets}
                    />
                  ) : (
                    <Indicator />
                  )}
                  <a className="btn btn-primary btn-bitbucket">
                  </a> Surveys
                  <br/>
                  <a className="btn btn-default btn-bitbucket"
                     style={{backgroundColor: '#DCDCDC', borderColor: '#DCDCDC', color: '#FFFFFF'}}>
                  </a> Scoring Successes
                  <br/>
                  <a className="btn btn-default btn-bitbucket"
                     style={{backgroundColor: '#b5b8cf', borderColor: '#b5b8cf', color: '#FFFFFF'}}>
                  </a> Scoring Errors
                  <br/>
                  <a className="btn btn-default btn-bitbucket"
                     style={{backgroundColor: '#E4F0FB', borderColor: '#E4F0FB', color: '#FFFFFF'}}>
                  </a> Feedback to Leaders
                </div>
                <div className="ibox-content">
                  <h4>To Leaders</h4>
                  {emailSentReady ? (
                    <LineChart
                      id="toLeaders"
                      labels={emailSentLabels}
                      datasets={emailToLeadersDataSets}
                    />
                  ) : (
                    <Indicator />
                  )}
                  <a className="btn btn-primary btn-bitbucket">
                  </a> Feedback to Employees
                  <br/>
                  <a className="btn btn-default btn-bitbucket"
                     style={{backgroundColor: '#DCDCDC', borderColor: '#DCDCDC', color: '#FFFFFF'}}>
                  </a> Weekly Digest
                </div>
                <div className="ibox-content">
                  <h4>Referrals</h4>
                  {emailSentReady ? (
                    <LineChart
                      id="referrals"
                      labels={emailSentLabels}
                      datasets={emailReferralsDataSets}
                    />
                  ) : (
                    <Indicator />
                  )}
                  <a className="btn btn-primary btn-bitbucket">
                  </a> Referrals
                </div>
                <div className="ibox-content">
                  <h4>Registration</h4>
                  {emailSentReady ? (
                    <LineChart
                      id="registration"
                      labels={emailSentLabels}
                      datasets={emailRegistrationDataSets}
                    />
                  ) : (
                    <Indicator />
                  )}
                  <a className="btn btn-primary btn-bitbucket">
                  </a> Welcome
                </div>
                <div className="ibox-content">
                  <h4>Support</h4>
                  {emailSentReady ? (
                    <LineChart
                      id="support"
                      labels={emailSentLabels}
                      datasets={emailSupportDataSets}
                    />
                  ) : (
                    <Indicator />
                  )}
                  <a className="btn btn-primary btn-bitbucket">
                  </a> Forgot Password
                  <br/>
                  <a className="btn btn-default btn-bitbucket"
                     style={{backgroundColor: '#DCDCDC', borderColor: '#DCDCDC', color: '#FFFFFF'}}>
                  </a> Forgot Alias
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <Spinner/>
      );
    }
  }
}

export default StatisticComponentContainer = createContainer(() => {
  const
    subUsers = Meteor.subscribe('statistic.users'),
    subEmployees = Meteor.subscribe('statistic.employees'),
    statisticReady = subUsers.ready() && subEmployees.ready(),
    totalActiveUsers = Accounts.users.find({username: {$exists: true}}).count(),
    totalActiveEmployees = Employees.find({status: STATUS_ACTIVE}).count()
    ;

  return {
    statisticReady,
    totalActiveUsers,
    totalActiveEmployees
  };
}, StatisticComponent);