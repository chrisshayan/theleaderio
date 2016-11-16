import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

// collections
import {Accounts} from 'meteor/accounts-base';
import {Organizations} from '/imports/api/organizations/index';
import {Employees} from '/imports/api/employees/index';
import {LogsEmail} from '/imports/api/logs/index';

// components
import Spinner from '/imports/ui/common/Spinner';
import LineChart from '/imports/ui/components/LineChart';
import Indicator from '/imports/ui/common/LoadingIndicator';
import Chosen from '/imports/ui/components/Chosen';

// methods
import {measureAdminStatistic} from '/imports/api/measures/methods';
import * as Notifications from '/imports/api/notifications/methods';

export default class StatisticComponent extends Component {
  constructor() {
    super();

    this.state = {
      ready: false,
      errors: null,
      newCreationStatistic: {},
      emailSentStatistic: {},
      emailToLeadersStatistic: {},
      emailToEmployeesStatistic: {},
      emailReferralsStatistic: {},
      emailRegistrationStatistic: {},
      emailSupportStatistic: {}
    };
  }

  componentDidMount() {
    // new creation
    measureAdminStatistic.call({
      params: {
        type: "NEW_CREATION",
        interval: "LAST_WEEK"
      }
    }, (error, newCreationStatistic) => {
      if (!error) {
        this.setState({
          ready: true,
          newCreationStatistic,
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
        type: "EMAIL_SENT",
        interval: "LAST_WEEK"
      }
    }, (error, emailSentStatistic) => {
      if (!error) {
        this.setState({
          emailSentStatistic,
          errors: null
        });
      } else {
        this.setState({
          errors: error.reason
        });
      }
    });
  }

  render() {
    const
      {
        // ready,
        errors,
        newCreationStatistic,
        emailSentStatistic,
        // emailToLeadersStatistic,
        // emailToEmployeesStatistic,
        // emailReferralsStatistic,
        // emailRegistrationStatistic,
        // emailSupportStatistic
      } = this.state,
      ready = newCreationStatistic.ready || emailSentStatistic.ready,
        // emailToLeadersStatistic.ready ||
        // emailToEmployeesStatistic.ready || emailReferralsStatistic.ready ||
        // emailRegistrationStatistic.ready || emailSupportStatistic.ready,
      dataSetsColors = [
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
          fillColor: "rgba(181, 184, 207, 0.5)",
          strokeColor: "rgba(181, 184, 207, 1)",
          pointColor: "rgba(181, 184, 207, 1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(181, 184, 207, 1)",
        }
      ]
      ;

    if (ready) {
      let
        newCreationDataSets = [],
        emailSentDataSets = [],
        emailToEmployeesDataSets = [],
        emailToLeadersDataSets = [],
        emailReferralsDataSets = [],
        emailRegistrationDataSets = [],
        emailSupportDataSets = []
        ;

      (!_.isEmpty(newCreationStatistic.data)) && (
        newCreationStatistic.data.map((dataset, key) => {
          newCreationDataSets.push({...dataSetsColors[key], data: dataset});
        })
      );
      if(!_.isEmpty(emailSentStatistic.data)) {
        // to employees
        emailToEmployeesDataSets.push({...dataSetsColors[0], data: emailSentStatistic.data[0]});
        emailToEmployeesDataSets.push({...dataSetsColors[1], data: emailSentStatistic.data[1]});
        emailToEmployeesDataSets.push({...dataSetsColors[2], data: emailSentStatistic.data[2]});
        emailToEmployeesDataSets.push({...dataSetsColors[3], data: emailSentStatistic.data[3]});
        // to leaders
        emailToLeadersDataSets.push({...dataSetsColors[0], data: emailSentStatistic.data[4]});
        emailToLeadersDataSets.push({...dataSetsColors[1], data: emailSentStatistic.data[5]});
        // referrals
        emailReferralsDataSets.push({...dataSetsColors[0], data: emailSentStatistic.data[6]});
        // registration
        emailRegistrationDataSets.push({...dataSetsColors[0], data: emailSentStatistic.data[7]});
        // support
        emailSupportDataSets.push({...dataSetsColors[0], data: emailSentStatistic.data[8]});
        emailSupportDataSets.push({...dataSetsColors[1], data: emailSentStatistic.data[9]});
    };

      return (
        <div className="row">
          <div className="col-md-8">
            <div className="ibox float-e-margins">
              <div className="ibox-title">
                <h3>New Creation</h3>
              </div>
              <div className="ibox-content">
                {newCreationStatistic.ready ? (
                  <LineChart
                    id="newCreation"
                    labels={newCreationStatistic.labels}
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
                <h3>Emails sent</h3>
              </div>
              <div className="ibox-content">
                <h4>To Employees</h4>
                {emailSentStatistic.ready ? (
                  <LineChart
                    id="toEmployees"
                    labels={emailSentStatistic.labels}
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
                </a> Scoring Errors
                <br/>
                <a className="btn btn-default btn-bitbucket"
                   style={{backgroundColor: '#b5b8cf', borderColor: '#b5b8cf', color: '#FFFFFF'}}>
                </a> Feedback to Leaders
              </div>
              <div className="ibox-content">
                <h4>To Leaders</h4>
                {emailSentStatistic.ready ? (
                  <LineChart
                    id="toLeaders"
                    labels={emailSentStatistic.labels}
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
                {emailSentStatistic.ready ? (
                  <LineChart
                    id="referrals"
                    labels={emailSentStatistic.labels}
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
                {emailSentStatistic.ready ? (
                  <LineChart
                    id="registration"
                    labels={emailSentStatistic.labels}
                    datasets={emailRegistrationDataSets}
                  />
                ) : (
                  <Indicator />
                )}
                <a className="btn btn-primary btn-bitbucket">
                </a> Welcome
              </div>
            </div>
            <div className="ibox-content">
              <h4>Support</h4>
              {emailSentStatistic.ready ? (
                <LineChart
                  id="support"
                  labels={emailSentStatistic.labels}
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
      );
    } else {
      return (
        <Spinner/>
      );
    }
  }
}