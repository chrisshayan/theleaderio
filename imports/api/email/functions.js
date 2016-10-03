import {Meteor} from 'meteor/meteor';
import emailTemplateBuilder from 'email-template-builder';
import {words as capitalize} from 'capitalize';

// collections
import {SendingPlans} from '/imports/api/sending_plans/index';
import {Profiles} from '/imports/api/profiles/index';
import {Organizations} from '/imports/api/organizations/index';
import {Employees} from '/imports/api/employees/index';

// methods
import {get as getDefaults} from '/imports/api/defaults/methods';

// constants
import * as ERROR_CODE from '/imports/utils/error_code';
const {domain, mailDomain} = Meteor.settings.public;
const SITE_NAME = Meteor.settings.public.name;

/**
 *
 * @param templateName
 * @param firstName
 * @param url
 * @param alias
 * @returns {*}
 */
export const get = function ({templateName, firstName, url, alias}) {
  const template = Assets.getText(`email_templates/${templateName}.html`);
  const data = {
    firstName: firstName,
    url: url,
    alias: alias
  };
  return emailTemplateBuilder.generate(data, template);
}

/**
 * Generate html with template and data
 * @param template
 * @param data
 * @returns {*}
 */
export const buildHtml = function ({template, data}) {
  const
    {type} = data
  ;
  let
    mailTemplate = ""
    ;
  switch (template) {
    case "survey": {
      mailTemplate = Assets.getText(`email_templates/metrics/${template}.html`);
      break;
    }
    case "survey_error": {
      mailTemplate = Assets.getText(`email_templates/metrics/${template}.html`);
      break;
    }
    case "feedback": {
      mailTemplate = Assets.getText(`email_templates/metrics/${template}.html`);
      break;
    }
    case "thankyou": {
      mailTemplate = Assets.getText(`email_templates/metrics/${template}.html`);
      break;
    }
    case "employee": {
      console.log(data)
      mailTemplate = Assets.getText(`email_templates/${template}/${type}.html`);
      break;
    }
    default: {
      mailTemplate = Assets.getText(`email_templates/${template}.html`);
    }
  }
  return emailTemplateBuilder.generate(data, mailTemplate);
}

/**
 * get the recipient information
 * @param recipient
 * @param sender
 * @returns {*}
 */
export const getRecipientInfo = ({recipient, sender, apiName}) => {
  if (typeof recipient == "undefined") {
    return false;
  }
  const
    recipientElements = recipient.split("-")
    ;
  switch (apiName) {
    case "metrics": {
      const
        planId = recipientElements[0],
        organizationId = recipientElements[1]
        ;

      const sendingPlan = SendingPlans.findOne({_id: planId});
      if (!_.isEmpty(sendingPlan)) {
        const {
          leaderId,
          metric,
          timezone
        } = sendingPlan;

        const employee = Employees.findOne({leaderId, organizationId, email: sender});
        if (!_.isEmpty(employee)) {
          const employeeId = employee._id;
          return {planId, employeeId, leaderId, organizationId, metric: metric.toLowerCase()};
        } else {
          return {};
        }
      } else {
        return {};
      }
      break;
    }
    case "employee": {
      const
        employeeId = recipientElements[0],
        organizationId = recipientElements[1],
        leaderId = recipientElements[2]
      ;

      return {employeeId, organizationId, leaderId};
    }
    default: {
      return {message: "Invalid API Name"};
    }
  }

}

/**
 *
 * @param content
 * @returns {*}
 */
export const removeWebGmailClientContent = (content) => {
  return content.split('\r\n\r\n--');
}


/**
 * Function to collect content data for survey email
 * @param template
 * @param data
 */
export const getSurveyEmailOptions = ({template, data}) => {
  const
    {planId, employeeId, leaderId, organizationId, metric} = data,
    EMAIL_TEMPLATE_CONTENT = getDefaults.call({name: 'EMAIL_TEMPLATE_CONTENT'}).content,
    mailData = {
      siteUrl: "",
      siteName: "",
      leaderProfileUrl: "",
      leaderName: "",
      alias: "",
      orgName: "",
      employeeName: "",
      replyGuideHeader: "",
      replyGuideMessage: "",
      message: "",
      description: "",
      metric: "",
      viewLeaderProfileHeader: ""
    };

  let
    result = {
      from: "",
      to: "",
      subject: "",
      html: ""
    },
    senderSuffix = "",
    subject = ""
    ;

  // Get data from collection
  const employee = Employees.findOne({_id: employeeId});
  if (_.isEmpty(employee)) {
    return new Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND, `employee ${employeeId} not found`);
  }
  const leaderData = Accounts.users.findOne({_id: leaderId});
  if (_.isEmpty(leaderData)) {
    return new Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND, `leader ${leaderId} not found`);
  }
  const leader = Profiles.findOne({userId: leaderId});
  if (_.isEmpty(leader)) {
    return new Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND, `leader ${leaderId} not found`);
  }
  const organization = Organizations.findOne({_id: organizationId});
  if (_.isEmpty(organization)) {
    return new Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND, `organization ${organizationId} not found`);
  }

  // get mail data
  mailData.alias = leaderData.username;
  mailData.siteUrl = `http://${domain}`;
  mailData.siteName = SITE_NAME;
  mailData.leaderProfileUrl = `http://${mailData.alias}.${domain}`;
  mailData.leaderName = `${capitalize(leader.firstName)} ${capitalize(leader.lastName)}`;
  mailData.orgName = `${capitalize(organization.name)}`;
  mailData.employeeName = `${capitalize(employee.firstName)}`;
  mailData.metric = capitalize(metric);

  // get from, subject and message
  switch (template) {
    case "survey": {
      mailData.replyGuideHeader = EMAIL_TEMPLATE_CONTENT.employee.metrics.replyGuideHeader;
      mailData.replyGuideMessage = EMAIL_TEMPLATE_CONTENT.employee.metrics.replyGuideMessage;
      mailData.message = `Please help your leader "${mailData.leaderName}" to improve "${mailData.metric}" management by giving a score.`;
      mailData.description = EMAIL_TEMPLATE_CONTENT.employee.metrics[metric];
      senderSuffix = template;
      subject = `${mailData.employeeName}, How "${mailData.leaderName}" can improve ${mailData.metric} Management?`;

      break;
    }
    case "survey_error": {
      mailData.replyGuideHeader = EMAIL_TEMPLATE_CONTENT.employee.metrics.replyGuideHeader;
      mailData.replyGuideMessage = EMAIL_TEMPLATE_CONTENT.employee.metrics.replyGuideMessage;
      mailData.message = `Please help "${mailData.leaderName}" to improve "${mailData.metric}" management by giving accurate score. The score should be a number from 1 to 5. If you think ${mailData.leaderName} is doing a great job, just reply the email by sending 5. If you think ${mailData.leaderName} is doing moderate job reply the email by sending 3 and if ${mailData.leaderName} is doing very bad then send 1.`;
      mailData.description = EMAIL_TEMPLATE_CONTENT.employee.metrics[metric];
      senderSuffix = "survey";
      subject = `${mailData.employeeName}, seems the score of "${mailData.metric}" has some issues.`;

      break;
    }
    case "feedback": {
      mailData.replyGuideHeader = EMAIL_TEMPLATE_CONTENT.employee[template].replyGuideHeader;
      mailData.replyGuideMessage = EMAIL_TEMPLATE_CONTENT.employee[template].replyGuideMessage;
      mailData.message = `"${mailData.leaderName}" needs your help to improve "${mailData.metric}" Management.`;
      mailData.description = `Your feedback is very important and it will be kept CONFIDENTIAL, it means ${mailData.leaderName} won’t be able to know who submitted the feedback.`;
      senderSuffix = template;
      subject = `${mailData.employeeName}, "${mailData.leaderName}" wants to improve ${mailData.metric}, how?`;
      break;
    }
    case "thankyou": {
      const {type} = data;
      mailData.message = `I appreciate your contribution on "${mailData.metric}" Management. I believe better leadership can help all of us to enjoy our daily life even more. Besides, it is very effective for you as an individual. The better the leader, happier employee.\nBest Regards,\ntheLeader.io on behalf of "${mailData.leaderName}"`;
      mailData.description = `Your ${type} will help ${mailData.leaderName} to improve.`;
      mailData.viewLeaderProfileHeader = `View ${mailData.leaderName} public profile?`;
      senderSuffix = template;
      subject = `${mailData.employeeName}, You’ve been heard. Leadership matters.`;
      break;
    }
  }

  result.subject = subject;
  result.from = `"${mailData.leaderName}" <${planId}-${organizationId}-${senderSuffix}@${mailDomain}>`;
  result.to = employee.email;
  result.html = buildHtml({template, data: mailData});

  return result;
}

/**
 * Function to collect content data for email to employees
 * @param template
 * @param data
 */
export const getEmployeeEmailOptions = ({template, data}) => {
  const
    {type, employeeId, leaderId, organizationId} = data,
    EMAIL_TEMPLATE_CONTENT = getDefaults.call({name: 'EMAIL_TEMPLATE_CONTENT'}).content,
    mailData = {
      type,
      siteUrl: "",
      siteName: "",
      employeeName: "",
      orgName: "",
      leaderName: "",
      message: "",
      description: "",
      replyGuideHeader: "",
      replyGuideMessage: ""
    };

  let
    result = {
      from: "",
      to: "",
      subject: "",
      html: ""
    },
    senderSuffix = "",
    subject = ""
    ;


  // Get data from collection
  const employee = Employees.findOne({_id: employeeId});
  if (_.isEmpty(employee)) {
    return new Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND, `employee ${employeeId} not found`);
  }
  const leaderData = Accounts.users.findOne({_id: leaderId});
  if (_.isEmpty(leaderData)) {
    return new Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND, `leader ${leaderId} not found`);
  }
  const leader = Profiles.findOne({userId: leaderId});
  if (_.isEmpty(leader)) {
    return new Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND, `leader ${leaderId} not found`);
  }
  const organization = Organizations.findOne({_id: organizationId});
  if (_.isEmpty(organization)) {
    return new Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND, `organization ${organizationId} not found`);
  }

  // get mail data
  mailData.siteUrl = `http://${domain}`;
  mailData.siteName = SITE_NAME;
  mailData.employeeName = `${capitalize(employee.firstName)}`;
  mailData.orgName = `${capitalize(organization.name)}`;
  mailData.leaderName = `${capitalize(leader.firstName)} ${capitalize(leader.lastName)}`;

  switch (type) {
    case "feedback": {
      mailData.replyGuideHeader = EMAIL_TEMPLATE_CONTENT.leader[type].replyGuideHeader;
      mailData.replyGuideMessage = EMAIL_TEMPLATE_CONTENT.leader[type].replyGuideMessage;
      mailData.message = `"${mailData.employeeName}" needs your help to improve Performance.`;
      mailData.description = `Your feedback will help ${mailData.employeeName} a lot.`;
      senderSuffix = `${template}-${type}`;
      subject = `How is the performance of "${mailData.employeeName}" in ${mailData.orgName}?`;
      break;
    }
    case "inform_feedback_from_leader": {

    }
    default: {
      return {message: "Unknown type."}
    }
  }

  result.subject = subject;
  result.from = `"${mailData.siteName}" <${employeeId}-${organizationId}-${leaderId}-${senderSuffix}@${mailDomain}>`;
  result.to = leaderData.emails[0].address;
  console.log({template, mailData})
  result.html = buildHtml({template, data: mailData});

  return result;
}