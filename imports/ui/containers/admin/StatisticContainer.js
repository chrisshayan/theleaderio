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

// methods
import {measureAdminStatistic} from '/imports/api/measures/methods';

export default class StatisticComponent extends Component {
  constructor() {
    super();

    this.state = {
      ready: false,
      errors: null,
      statistic: {}
    };
  }

  componentWillMount() {
    measureAdminStatistic.call({params: {days: 7}}, (error, statistic) => {
      if (!error) {
        this.setState({
          ready: true,
          statistic
        });
      } else {
        this.setState({
          ready: true,
          errors: error.reason
        });
      }
    });
  }

  render() {
    const
      {ready, errors, statistic} = this.state
      ;

    // console.log(this.props)

    if (ready) {
      const
        {
          labels,
          users, organizations, employees,
          emailRegistration,
          emailForgotAlias, emailForgotPassword,
          emailSurveys, emailScoringErrors, emailFeedbackToLeaders,
          emailFeedbackToEmployees,
          emailWeeklyDigest,
          emailReferral
        } = statistic,
        newCreationDataSets = [
          {
            data: users,
            fillColor: "rgba(26, 179, 148, 0.5)",
            strokeColor: "rgba(26, 179, 148, 0.7)",
            pointColor: "rgba(26, 179, 148, 1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(26, 179, 148, 1)",
          },
          {
            data: organizations,
            fillColor: "rgba(220, 220, 220, 0.5)",
            strokeColor: "rgba(220, 220, 220, 1)",
            pointColor: "rgba(220, 220, 220, 1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
          },
          {
            data: employees,
            fillColor: "rgba(181, 184, 207, 0.5)",
            strokeColor: "rgba(181, 184, 207, 1)",
            pointColor: "rgba(181, 184, 207, 1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(181, 184, 207, 1)",
          }
        ],
        emailRegistrationDataSets = [
          {
            data: emailRegistration,
            fillColor: "rgba(26, 179, 148, 0.5)",
            strokeColor: "rgba(26, 179, 148, 0.7)",
            pointColor: "rgba(26, 179, 148, 1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(26, 179, 148, 1)",
          }
        ],
        emailSupportDataSets = [
          {
            data: emailForgotPassword,
            fillColor: "rgba(26, 179, 148, 0.5)",
            strokeColor: "rgba(26, 179, 148, 0.7)",
            pointColor: "rgba(26, 179, 148, 1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(26, 179, 148, 1)",
          },
          {
            data: emailForgotAlias,
            fillColor: "rgba(220, 220, 220, 0.5)",
            strokeColor: "rgba(220, 220, 220, 1)",
            pointColor: "rgba(220, 220, 220, 1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
          }
        ],
        emailToEmployeesDataSets = [
          {
            data: emailSurveys,
            fillColor: "rgba(26, 179, 148, 0.5)",
            strokeColor: "rgba(26, 179, 148, 0.7)",
            pointColor: "rgba(26, 179, 148, 1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(26, 179, 148, 1)",
          },
          {
            data: emailScoringErrors,
            fillColor: "rgba(220, 220, 220, 0.5)",
            strokeColor: "rgba(220, 220, 220, 1)",
            pointColor: "rgba(220, 220, 220, 1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
          },
          {
            data: emailFeedbackToLeaders,
            fillColor: "rgba(181, 184, 207, 0.5)",
            strokeColor: "rgba(181, 184, 207, 1)",
            pointColor: "rgba(181, 184, 207, 1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(181, 184, 207, 1)",
          }
        ],
        emailToLeadersDataSets = [
          {
            data: emailFeedbackToEmployees,
            fillColor: "rgba(26, 179, 148, 0.5)",
            strokeColor: "rgba(26, 179, 148, 0.7)",
            pointColor: "rgba(26, 179, 148, 1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(26, 179, 148, 1)",
          },
          {
            data: emailWeeklyDigest,
            fillColor: "rgba(220, 220, 220, 0.5)",
            strokeColor: "rgba(220, 220, 220, 1)",
            pointColor: "rgba(220, 220, 220, 1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
          }
        ],
        emailReferralDataSets = [
          {
            data: emailReferral,
            fillColor: "rgba(26, 179, 148, 0.5)",
            strokeColor: "rgba(26, 179, 148, 0.7)",
            pointColor: "rgba(26, 179, 148, 1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(26, 179, 148, 1)",
          }
        ]
        ;

      return (
        <div className="row">
          <div className="col-md-8">
            <div className="ibox float-e-margins">
              <div className="ibox-title">
                <h3>New Creation</h3>
              </div>
              <div className="ibox-content">
                <LineChart
                  id="newCreation"
                  labels={labels}
                  datasets={newCreationDataSets}
                />
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
                <h4>Registration</h4>
                <LineChart
                  id="registration"
                  labels={labels}
                  datasets={emailRegistrationDataSets}
                />
                <a className="btn btn-primary btn-bitbucket">
                </a> Welcome
              </div>
            </div>
            <div className="ibox-content">
              <h4>Support</h4>
              <LineChart
                id="support"
                labels={labels}
                datasets={emailSupportDataSets}
              />
              <a className="btn btn-primary btn-bitbucket">
              </a> Forgot Password
              <br/>
              <a className="btn btn-default btn-bitbucket"
                 style={{backgroundColor: '#DCDCDC', borderColor: '#DCDCDC', color: '#FFFFFF'}}>
              </a> Forgot Alias
            </div>
            <div className="ibox-content">
              <h4>To Employees</h4>
              <LineChart
                id="toEmployees"
                labels={labels}
                datasets={emailToEmployeesDataSets}
              />
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
              <LineChart
                id="toLeaders"
                labels={labels}
                datasets={emailToLeadersDataSets}
              />
              <a className="btn btn-primary btn-bitbucket">
              </a> Feedback to Employees
              <br/>
              <a className="btn btn-default btn-bitbucket"
                 style={{backgroundColor: '#DCDCDC', borderColor: '#DCDCDC', color: '#FFFFFF'}}>
              </a> Weekly Digest
            </div>
            <div className="ibox-content">
              <h4>Referrals</h4>
              <LineChart
                id="referrals"
                labels={labels}
                datasets={emailReferralDataSets}
              />
              <a className="btn btn-primary btn-bitbucket">
              </a> Referrals
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