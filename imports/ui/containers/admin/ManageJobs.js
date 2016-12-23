import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Roles} from 'meteor/alanning:roles';
import {Session} from 'meteor/session';

// components
import NoticeForm from '/imports/ui/common/NoticeForm';
import Spinner from '/imports/ui/common/Spinner';
import Chosen from '/imports/ui/components/Chosen';
import FormManageJob from '/imports/ui/components/FormManageJob';

// collections
import {Administration} from '/imports/api/admin/index';

// methods
import * as Notifications from '/imports/api/notifications/functions';
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
      currentSchedule: {
        sendFeedbackForEmployee: {},
        sendStatisticForLeader: {}
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

  componentWillReceiveProps(nextProps) {
    const
      {
        AdminJobs
      } = nextProps;
    let
      sendFeedbackForEmployee = {},
      sendStatisticForLeader = {}
      ;

    // console.log(AdminJobs)
    if (!_.isEmpty(AdminJobs)) {
      AdminJobs.map(job => {
        switch (job.name) {
          case "feedback_for_employee": {
            sendFeedbackForEmployee = {
              frequency: job.data.frequency, // index of the frequency
              day: job.data.day,
              hour: job.data.hour,
              minute: job.data.minute,
              disableDayOfWeek: job.data.disableDayOfWeek,
              disableDayOfMonth: job.data.disableDayOfMonth
            };
            break;
          }
          case "statistic_for_leader": {
            sendStatisticForLeader = {
              frequency: job.data.frequency, // index of the frequency
              day: job.data.day,
              hour: job.data.hour,
              minute: job.data.minute,
              disableDayOfWeek: job.data.disableDayOfWeek,
              disableDayOfMonth: job.data.disableDayOfMonth
            };
            break;
          }
          default: {
            this.setState({
              error: "Unknown job!"
            });
          }
        }
      });
      this.setState({
        currentSchedule: {
          sendFeedbackForEmployee,
          sendStatisticForLeader
        }
      });
    }
  }

  onFormManageJobSubmit({type, schedule}) {
    const
      params = {
        type,
        schedule: getCronExpression({params: schedule}),
        data: {}
      }
      ;

    editJobSchedule.call({
      type: "job",
      name: type,
      data: schedule
    }, (error, result) => {
      if (!error) {
        editAdminJob.call({
          params: {
            type,
            schedule: getCronExpression({params: schedule}),
            data: {}
          }
        }, (error) => {
          if (!error) {
            const
              closeButton = true,
              title = 'Send performance feedback emails to leaders',
              message = 'Edited'
              ;
            Notifications.success({closeButton, title, message});
          } else {
            const
              closeButton = true,
              title = 'Send performance feedback emails to leaders',
              message = `Edit failed - ${error.reason}`
              ;
            Notifications.error({closeButton, title, message});
          }
        });
      } else {
        const
          closeButton = true,
          title = 'Send performance feedback emails to leaders',
          message = `Edit failed - ${error.reason}`
          ;
        Notifications.error({closeButton, title, message});
      }
    });

  }

  render() {
    const
      {
        ready,
        error,
        currentSchedule
      } = this.state
      ;

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
                  <FormManageJob
                    type="feedback_for_employee"
                    currentSchedule={currentSchedule.sendFeedbackForEmployee}
                    onSubmit={this.onFormManageJobSubmit}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h4>Send statistic emails to leaders</h4>
                </div>
                <div className="ibox-content">
                  <FormManageJob
                    type="statistic_for_leader"
                    currentSchedule={currentSchedule.sendStatisticForLeader}
                    onSubmit={this.onFormManageJobSubmit}
                  />
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
    ready = sub.ready(),
    AdminJobs = Administration.find({type: "job"}).fetch()
    ;

  return {
    ready,
    AdminJobs
  };
}, ManageJobs);