import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Roles} from 'meteor/alanning:roles';
import {Session} from 'meteor/session';

//cache
import {MiniMongo} from '/imports/api/cache/index';

// components
import NoticeForm from '/imports/ui/common/NoticeForm';
import Spinner from '/imports/ui/common/Spinner';
import Chosen from '/imports/ui/components/Chosen';

// collections
import {Administration} from '/imports/api/admin/index';

// methods
import * as Notifications from '/imports/api/notifications/methods';
import {verifyAdminRole} from '/imports/api/users/methods';
import {editAdminJob} from '/imports/api/jobs/methods';
import {add as addJobSchedule, edit as editJobSchedule} from '/imports/api/admin/methods';

// functions
import {getCronExpression} from '/imports/utils/index';

// constants
import {JOB_FREQUENCY, DAY_OF_WEEK, DAY_OF_MONTH, HOUR_OF_DAY, MINUTE_OF_AN_HOUR} from '/imports/utils/defaults';
import * as ERROR_CODE from '/imports/utils/error_code';

class ManageJobs extends Component {
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
    // const
    //   {sendFeedbackEmailToLeaderJob} = this.props;

    this.setState({
      ready: 0
    });
    if (!!Meteor.userId()) {
      verifyAdminRole.call({userId: Meteor.userId()}, (error, result) => {
        if (!error) {
          if (result.isAdmin) {
            // get current value of job sendFeedbackEmailToLeader
            // if(!_.isEmpty(sendFeedbackEmailToLeaderJob)) {
            //   this.setState({
            //     ready: 1,
            //     error: "",
            //     sendFeedbackForEmployee: {
            //       frequency: sendFeedbackEmailToLeaderJob.data.frequency, // index of the frequency
            //       day: sendFeedbackEmailToLeaderJob.data.day,
            //       hour: sendFeedbackEmailToLeaderJob.data.hour,
            //       minute: sendFeedbackEmailToLeaderJob.data.minute,
            //       disableDayOfWeek: sendFeedbackEmailToLeaderJob.data.disableDayOfWeek,
            //       disableDayOfMonth: sendFeedbackEmailToLeaderJob.data.disableDayOfMonth
            //     }
            //   });
            // }
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

  componentWillReceiveProps(nextProps) {
    const
      {sendFeedbackEmailToLeaderJob} = nextProps;

    // get current value of job sendFeedbackEmailToLeader
    if(!_.isEmpty(sendFeedbackEmailToLeaderJob)) {
      this.setState({
        sendFeedbackForEmployee: {
          frequency: sendFeedbackEmailToLeaderJob.data.frequency, // index of the frequency
          day: sendFeedbackEmailToLeaderJob.data.day,
          hour: sendFeedbackEmailToLeaderJob.data.hour,
          minute: sendFeedbackEmailToLeaderJob.data.minute,
          disableDayOfWeek: sendFeedbackEmailToLeaderJob.data.disableDayOfWeek,
          disableDayOfMonth: sendFeedbackEmailToLeaderJob.data.disableDayOfMonth
        }
      });
    }
  }

  _sendFeedbackForEmployeeSubmit() {
    const
      {sendFeedbackForEmployee} = this.state,
      params = {
        type: "feedback_for_employee",
        schedule: getCronExpression({params: sendFeedbackForEmployee}),
        data: {}
      }
      ;

    editJobSchedule.call({
      type: "job",
      name: "sendFeedbackEmailToLeader",
      data: sendFeedbackForEmployee
    }, (error, result) => {
      if(!error) {
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
        sendFeedbackEmailToLeaderJob
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

      console.log(sendFeedbackForEmployee)

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
                        selectedOptions={JOB_FREQUENCY[sendFeedbackForEmployee.frequency]}
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
                        selectedOptions={DAY_OF_MONTH[sendFeedbackForEmployee.day]}
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
                        selectedOptions={DAY_OF_WEEK[sendFeedbackForEmployee.day]}
                        isMultiple={chosenProps.dayOfWeek.isMultiple}
                        placeHolder={chosenProps.dayOfWeek.placeHolder}
                        onChange={chosenProps.dayOfWeek.onChange}
                      />
                    </div>
                    {" at "}
                    <div className="form-group">
                      <Chosen
                        options={chosenProps.hour.options}
                        selectedOptions={HOUR_OF_DAY[sendFeedbackForEmployee.hour]}
                        isMultiple={chosenProps.hour.isMultiple}
                        placeHolder={chosenProps.hour.options[chosenProps.hour.options.length - 1]}
                        onChange={chosenProps.hour.onChange}
                      />
                    </div>
                    {" : "}
                    <div className="form-group">
                      <Chosen
                        options={chosenProps.minute.options}
                        selectedOptions={MINUTE_OF_AN_HOUR[sendFeedbackForEmployee.minute]}
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

export default ManageJobsContainer = createContainer((params) => {
  const
    sub = Meteor.subscribe("administration"),
    ready = sub.ready()
  ;
  let
    // AdminJobs = Administration.find({type: "job"}).fetch(),
    sendFeedbackEmailToLeaderJob = {}
  ;

  sendFeedbackEmailToLeaderJob = Administration.findOne({name: "sendFeedbackEmailToLeader"});

  return {
    ready,
    sendFeedbackEmailToLeaderJob
  };
}, ManageJobs);