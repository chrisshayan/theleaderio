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
  const metricTemplate = ["survey", "survey_error", "feedback", "thankyou"];
  if (_.indexOf(metricTemplate, template) !== -1) {
    const mailTemplate = Assets.getText(`email_templates/metrics/${template}.html`);
    return emailTemplateBuilder.generate(data, mailTemplate);
  } else {
    {
      const mailTemplate = Assets.getText(`email_templates/${template}.html`);
      return emailTemplateBuilder.generate(data, mailTemplate);
    }
  }
}

/**
 * get the recipient information
 * @param recipient
 * @param sender
 * @returns {*}
 */
export const getRecipientInfo = ({recipient, sender}) => {
  if (typeof recipient == "undefined") {
    return false;
  }
  const recipientElements = recipient.split("-");
  // console.log(recipientElements)
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
      return false;
    }
  } else {
    return false;
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
      leaderGender: "",
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
  mailData.leaderGender = "";
  mailData.orgName = `${capitalize(organization.name)}`;
  mailData.employeeName = `${capitalize(employee.firstName)}`;
  mailData.metric = capitalize(metric);

  // get from, subject and message
  switch (template) {
    case "survey":
    {
      mailData.replyGuideHeader = EMAIL_TEMPLATE_CONTENT.metrics.replyGuideHeader;
      mailData.replyGuideMessage = EMAIL_TEMPLATE_CONTENT.metrics.replyGuideMessage;
      mailData.message = `Please help your leader "${mailData.leaderName}" to improve "${mailData.metric}" management by giving ${mailData.leaderGender} a score.`;
      mailData.description = EMAIL_TEMPLATE_CONTENT.metrics[metric];
      senderSuffix = template;
      subject = `${mailData.employeeName}, How "${mailData.leaderName}" can improve ${mailData.leaderGender} score on ${mailData.metric} Management?`;

      break;
    }
    case "survey_error":
    {
      mailData.replyGuideHeader = EMAIL_TEMPLATE_CONTENT.metrics.replyGuideHeader;
      mailData.replyGuideMessage = EMAIL_TEMPLATE_CONTENT.metrics.replyGuideMessage;
      mailData.message = `Please help your leader "${mailData.leaderName}" to improve "${mailData.metric}" management by giving ${mailData.leaderGender} a score.`;
      mailData.description = EMAIL_TEMPLATE_CONTENT.metrics[metric];
      senderSuffix = "survey";
      subject = `Please correct the score about "${mailData.metric}" for ${mailData.leaderName} in ${mailData.orgName}.`;

      break;
    }
    case "feedback":
    {
      mailData.replyGuideHeader = EMAIL_TEMPLATE_CONTENT[template].replyGuideHeader;
      mailData.replyGuideMessage = `Simply reply this email with your suggestion for ${mailData.leaderName}  to improve ${mailData.leaderGender} ${mailData.metric} Management.`;
      mailData.message = `Help your leader "${mailData.leaderName}" to improve "${mailData.metric}" Management.`;
      mailData.description = EMAIL_TEMPLATE_CONTENT[template].description;
      senderSuffix = template;
      subject = `How could "${mailData.leaderName}" improve the ${mailData.metric} for higher score?`;
      break;
    }
    case "thankyou":
    {
      const {type} = data;
      mailData.message = `Thank you very much for your ${type} to "${mailData.leaderName}" about ${mailData.leaderGender} "${mailData.metric}" Management.`;
      mailData.description = `Your ${type} will help the leader to improve ${mailData.leaderGender} ability.`;
      mailData.viewLeaderProfileHeader = `Want to view ${mailData.leaderName} profile?`;
      senderSuffix = template;
      subject = `Thank you for your ${type}`;
      break;
    }
  }

  result.subject = subject;
  result.from = `"${mailData.leaderName}" <${planId}-${organizationId}-${senderSuffix}@${mailDomain}>`;
  result.to = employee.email;
  result.html = buildHtml({template, data: mailData});

  return result;
}