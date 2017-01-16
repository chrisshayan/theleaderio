import {Meteor} from 'meteor/meteor';
import {Questions} from '/imports/api/questions/index';
import {Profiles} from '/imports/api/profiles/index';
import {Organizations} from '/imports/api/organizations/index';
import {Employees} from '/imports/api/employees/index';

// methods
import * as EmailActions from '/imports/api/email/methods';

// functions
import {replaceEscapeCharacterWithBRTag} from '/imports/utils/index';
import {words as capitalize} from 'capitalize';

// constant
const {domain} = Meteor.settings.public;

/**
 * Function send emails to all active employees in 1 organization about the answer of leader.
 * @param leaderId
 * @param organizationId
 * @param question
 * @param answer
 */
export const sendNotificationEmails = (questionId) => {
  const
    questions = Questions.findOne({_id: questionId}),
    name = "sendInformAnswerToEmployees"
    ;
  if (!_.isEmpty(questions)) {
    const
      {leaderId, organizationId, question, answer} = questions,
      profile = Profiles.findOne({userId: leaderId}),
      org = Organizations.findOne({_id: organizationId}),
      employees = Employees.find({leaderId, organizationId}).fetch()
      ;

    if (!_.isEmpty(profile) && !_.isEmpty(org) && !_.isEmpty(employees)) {
      const
        {firstName, lastName} = profile,
        leaderName = `${firstName} ${lastName}`,
        {name: orgName} = org
        ;

      employees.map(employee => {
        const
          {firstName: employeeName, email} = employee,
          template = 'inform_answer',
          viewQuestionsUrl = `http://${domain}/questions/view/${organizationId}`,
          data = {
            leaderName,
            orgName,
            employeeName,
            question,
            answer: replaceEscapeCharacterWithBRTag(answer),
            viewQuestionsUrl,
            email
          };

        // console.log({leaderName, orgName, employeeName, email, question, answer});
        EmailActions.send.call({template, data});
      });
    }
  }
};

/**
 * Funtion send thank you email to employee after asked question
 * @param leaderId
 * @param organizationId
 * @param employeeId
 * @param questionId
 */
export const sendThankYouEmailToEmployee = ({leaderId, organizationId, employeeId}) => {
  const name = "sendInformAnswerToEmployees";
  const
    profile = Profiles.findOne({userId: leaderId}),
    employee = Employees.findOne({_id: employeeId, leaderId, organizationId})
    ;

  if (!_.isEmpty(profile) && !_.isEmpty(employee)) {
    const
      {firstName, lastName} = profile,
      leaderName = capitalize(`${firstName} ${lastName}`),
      {firstName: employeeName, email} = employee
      ;

    const
      template = 'thankYou',
      data = {
        action: 'question',
        leaderName,
        employeeName: capitalize(employeeName),
        message: `Your question had been sent to ${capitalize(leaderName)} anonymously.`,
        description: `We will continuously remind the leader to reply your questions. As soon as he replied in a jiffy we will notify everyone in your team with question and answer.`,
        haveButton: true,
        buttonHeader: `You can ask and view more questions by visit this page:`,
        buttonUrl: `http://${domain}/questions/view/${organizationId}`,
        buttonLabel: `View other questions.`,
        email
      };

    // console.log({template, data});
    EmailActions.send.call({template, data});
  }
};