import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Roles} from 'meteor/alanning:roles';
import {Session} from 'meteor/session';

// components
import NoticeForm from '/imports/ui/common/NoticeForm';
import Spinner from '/imports/ui/common/Spinner';
import Chosen from '/imports/ui/components/Chosen';

// methods
import * as Notifications from '/imports/api/notifications/methods';
import {verifyAdminRole} from '/imports/api/users/methods';
import {editAdminJob} from '/imports/api/jobs/methods';

// functions
import {getCronExpression} from '/imports/utils/index';

// constants
import {JOB_FREQUENCY, DAY_OF_WEEK, DAY_OF_MONTH, HOUR_OF_DAY, MINUTE_OF_AN_HOUR} from '/imports/utils/defaults';
import * as ERROR_CODE from '/imports/utils/error_code';

export default class ManageJobs extends Component {
  constructor() {
    super();

    this.state = {
      ready: 0,
      error: "",
      sendFeedbackForEmployee: {
        frequency: 0, // index of the frequency
        day: 0,
        hour: 0,
        minute: 0,
        disableDayOfWeek: false,
        disableDayOfMonth: true
      }
    };
  }

  componentWillMount() {
    this.setState({
      ready: 0
    });
    if (!!Meteor.userId()) {
      verifyAdminRole.call({userId: Meteor.userId()}, (error, result) => {
        if (!error) {
          if (result.isAdmin) {
            this.setState({
              ready: 1,
              error: ""
            });
          } else {
            this.setState({
              ready: -1,
              error: ERROR_CODE.PERMISSION_DENIED
            });
          }
        } else {
          this.setState({
            ready: -1,
            error: error.reason
          });
        }
      });
    }
  }

  _sendFeedbackForEmployeeSubmit() {
    const
      params = {
        type: "feedback_for_employee",
        schedule: getCronExpression({params: this.state.sendFeedbackForEmployee}),
        data: {}
      }
      ;

    editAdminJob.call({params}, (error) => {
      if(!error) {
        const
          closeButton = true,
          title = 'Send performance feedback emails to leaders',
          message = 'Edited'
          ;
        Notifications.success.call({closeButton, title, message});
      } else {
        const
          closeButton = true,
          title = 'Send performance feedback emails to leaders',
          message = `Edit failed - ${error.reason}`
          ;
        Notifications.error.call({closeButton, title, message});
      }
    });
  }

  render() {
    const
      {
        admin
      } = this.props,
      {
        ready,
        error,
        sendFeedbackForEmployee
      } = this.state,
      chosenProps = {
        frequency: {
          options: JOB_FREQUENCY,
          selectedOptions: JOB_FREQUENCY[0],
          chosenClass: 'chosen-select form-control',
          isMultiple: false,
          placeHolder: 'Frequency',
          onChange: (selected) => {
            if (selected === "Every Month") {
              this.setState({
                sendFeedbackForEmployee: {
                  ...sendFeedbackForEmployee,
                  frequency: _.indexOf(JOB_FREQUENCY, selected),
                  disableDayOfWeek: true,
                  disableDayOfMonth: false
                }
              });
            } else {
              this.setState({
                sendFeedbackForEmployee: {
                  ...sendFeedbackForEmployee,
                  frequency: _.indexOf(JOB_FREQUENCY, selected),
                  disableDayOfWeek: false,
                  disableDayOfMonth: true
                }
              });
            }
          }
        },
        dayOfWeek: {
          options: DAY_OF_WEEK,
          selectedOptions: DAY_OF_WEEK[0],
          chosenClass: 'chosen-select form-control',
          isMultiple: false,
          placeHolder: 'Day',
          onChange: (selected) => {
            this.setState({
              sendFeedbackForEmployee: {
                ...sendFeedbackForEmployee,
                day: _.indexOf(DAY_OF_WEEK, selected)
              }
            });
          }
        },
        dayOfMonth: {
          options: DAY_OF_MONTH,
          selectedOptions: DAY_OF_MONTH[0],
          chosenClass: 'chosen-select form-control',
          isMultiple: false,
          placeHolder: 'Day',
          onChange: (selected) => {
            this.setState({
              sendFeedbackForEmployee: {
                ...sendFeedbackForEmployee,
                day: (_.indexOf(DAY_OF_MONTH, selected) + 1)
              }
            });
          }
        },
        hour: {
          options: HOUR_OF_DAY,
          selectedOptions: HOUR_OF_DAY[0],
          chosenClass: 'chosen-select form-control',
          isMultiple: false,
          placeHolder: 'Hour',
          onChange: (selected) => {
            this.setState({
              sendFeedbackForEmployee: {
                ...sendFeedbackForEmployee,
                hour: _.indexOf(HOUR_OF_DAY, Number(selected))
              }
            });
          }
        },
        minute: {
          options: MINUTE_OF_AN_HOUR,
          selectedOptions: MINUTE_OF_AN_HOUR[0],
          chosenClass: 'chosen-select form-control',
          isMultiple: false,
          placeHolder: 'Minute',
          onChange: (selected) => {
            this.setState({
              sendFeedbackForEmployee: {
                ...sendFeedbackForEmployee,
                minute: _.indexOf(MINUTE_OF_AN_HOUR, Number(selected))
              }
            });
          }
        }
      },
      styles = {
        button: {
          marginBottom: 0
        }
      }
      ;
    // console.log(this.state)
    if (ready === 1) {
      return (
        <div>
          <div className="row">
            <div className="col-md-8">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h4>Send performance feedback emails to leaders</h4>
                </div>
                <div className="ibox-content">
                  <form action="" className="form-inline"
                        onSubmit={(event) => {
                        event.preventDefault();
                        this._sendFeedbackForEmployeeSubmit();
                      }}
                  >
                    <div className="form-group">
                      <Chosen
                        options={chosenProps.frequency.options}
                        selectedOptions={chosenProps.frequency.selectedOptions}
                        isMultiple={chosenProps.frequency.isMultiple}
                        placeHolder={chosenProps.frequency.placeHolder}
                        onChange={chosenProps.frequency.onChange}
                      />
                    </div>
                    {" on "}
                    <div className="form-group">
                      <Chosen
                        disabled={sendFeedbackForEmployee.disableDayOfMonth}
                        options={chosenProps.dayOfMonth.options}
                        selectedOptions={chosenProps.dayOfMonth.selectedOptions}
                        isMultiple={chosenProps.dayOfMonth.isMultiple}
                        placeHolder={chosenProps.dayOfMonth.placeHolder}
                        onChange={chosenProps.dayOfMonth.onChange}
                      />
                    </div>
                    {" "}
                    <div className="form-group">
                      <Chosen
                        disabled={sendFeedbackForEmployee.disableDayOfWeek}
                        options={chosenProps.dayOfWeek.options}
                        selectedOptions={chosenProps.dayOfWeek.selectedOptions}
                        isMultiple={chosenProps.dayOfWeek.isMultiple}
                        placeHolder={chosenProps.dayOfWeek.placeHolder}
                        onChange={chosenProps.dayOfWeek.onChange}
                      />
                    </div>
                    {" at "}
                    <div className="form-group">
                      <Chosen
                        options={chosenProps.hour.options}
                        selectedOptions={chosenProps.hour.selectedOptions}
                        isMultiple={chosenProps.hour.isMultiple}
                        placeHolder={chosenProps.hour.options[chosenProps.hour.options.length - 1]}
                        onChange={chosenProps.hour.onChange}
                      />
                    </div>
                    {" : "}
                    <div className="form-group">
                      <Chosen
                        options={chosenProps.minute.options}
                        selectedOptions={chosenProps.minute.selectedOptions}
                        isMultiple={chosenProps.minute.isMultiple}
                        placeHolder={chosenProps.minute.options[chosenProps.minute.options.length - 1]}
                        onChange={chosenProps.minute.onChange}
                      />
                    </div>
                    <div className="form-group pull-right">
                      <button className="btn btn-sm btn-primary" type="submit" style={styles.button}>Save changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (ready === 0) {
      return (
        <Spinner/>
      );
    } else {
      return (
        <NoticeForm
          code='403'
          message={error}
          description='Sorry, You do not have permission to access this page.'
          buttonLabel='Come back to HomePage'
        />
      );
    }
  }
}