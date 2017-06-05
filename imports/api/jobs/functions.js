// Job Collection
import {AdminJobs} from '/imports/api/jobs/collections';

// collections
import {Organizations} from '/imports/api/organizations/index';
import {Employees} from '/imports/api/employees/index';

// Job
import {Jobs} from '/imports/api/jobs/jobs';

// methods
import * as EmailActions from '/imports/api/email/methods';

// functions
import {getRandomEmployee} from '/imports/api/organizations/functions';


/**
 * Function send email to leader to receive feedback for an employee who will be choose randomly
 * @param job
 * @param cb
 */
export const sendFeedbackEmailToLeader = function(job, cb) {
  const
    name = "sendFeedbackEmailToLeader",
    activeOrgList = Organizations.find({isPresent: true}, {fields: {_id: true}}).fetch()
    ;
  let
    employee = {},
    employeeData = {}

  if(_.isEmpty(activeOrgList)) {
    job.log({name, message: "No active organization"});
    job.done();
    cb();
  } else {
    activeOrgList.map(org => {
      const
        employee = getRandomEmployee({params: {organizationId: org._id}})
        ;
      if(!_.isEmpty(employee)) {
        if(employee.message === 'undefined') {
          Logger.error({name, message: {detail: employee.message}});
        } else {
          employeeData = Employees.findOne({_id: employee.employeeId});
          if(!_.isEmpty(employeeData)) {
            const
              template = 'employee',
              data = {
                type: "feedback",
                employeeId: employeeData._id,
                leaderId: employeeData.leaderId,
                organizationId: employeeData.organizationId
              };
            EmailActions.send.call({template, data}, (error) => {
              if (_.isEmpty(error)) {
                job.log({name, message: {detail: `Send email to leader ${employeeData.leaderId} about employee ${employeeData._id} - success`}});
              } else {
                job.log({name, message: {detail: `Send email to leader ${employeeData.leaderId} about employee ${employeeData._id} - failed`}});
              }
            });
          } else {
            job.log({name, message: {detail: `Employee ${employee.employeeId} not exists`}});
          }
        }
      }
    });
    job.done();
    cb();
  }
};