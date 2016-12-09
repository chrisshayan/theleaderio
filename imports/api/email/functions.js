import {Meteor} from 'meteor/meteor';
import emailTemplateBuilder from 'email-template-builder';
import {words as capitalize} from 'capitalize';
import {HTTP} from 'meteor/http'

// collections
import {Accounts} from 'meteor/accounts-base';
import {SendingPlans} from '/imports/api/sending_plans/index';
import {Profiles} from '/imports/api/profiles/index';
import {Organizations} from '/imports/api/organizations/index';
import {Employees} from '/imports/api/employees/index';

// methods
import {get as getDefaults} from '/imports/api/defaults/methods';

// functions
import {add as addLogs} from '/imports/api/logs/functions';

// constants
import * as ERROR_CODE from '/imports/utils/error_code';
const
  {domain, mailDomain} = Meteor.settings.public,
  SITE_NAME = Meteor.settings.public.name
  ;

/**
 * Function send mail by using mailgun API
 * @param options
 */
export const sendMail = ({options}) => {
  const
    {baseUrl: MAILGUN_BASE_URL, key: MAILGUN_API_KEY} = Meteor.settings.MAILGUN_API,
    sendMailUrl = `${MAILGUN_BASE_URL}/messages`,
    {
      from, to, subject, html,
      tag,
      userVariables = {}
    } = options,
    params = {
      from,
      to,
      subject,
      html,
      "o:tag": tag,
      "h:X-Mailgun-Variables": userVariables
    }
    ;
  let
    logName = "sendEmail",
    logContent = {options}
    ;

  // remove html property
  delete logContent.options.html;

  Meteor.http.post(sendMailUrl, {
    auth: "api:" + MAILGUN_API_KEY,
    params
  }, function (error, result) {
    if (!error) {
      logContent.result = result;
      addLogs({params: {name: logName, content: logContent}});
    } else {
      logContent.error = error;
      addLogs({params: {name: logName, content: logContent}});
    }
  });
}

/**
 * Function create campaign in mailgun
 * @param {String} name - campaign name
 * @param {String} id - campaign id
 */
export const createCampaign = ({params}) => {
  const
    {baseUrl: MAILGUN_BASE_URL, key: MAILGUN_API_KEY} = Meteor.settings.MAILGUN_API,
    createCampaignslUrl = `${MAILGUN_BASE_URL}/campaigns`,
    {
      name,
      id
    } = params
    ;

  Meteor.http.post(createCampaignslUrl, {
    auth: "api:" + MAILGUN_API_KEY,
    params
  }, function (error, result) {
    console.log({error, result})
  });
}


/**
 * Function poll events from mailgun
 * @param {String} type -
 * @param {}
 */
export const pollEvents = ({params}) => {
  const
    {baseUrl: MAILGUN_BASE_URL, key: MAILGUN_API_KEY} = Meteor.settings.MAILGUN_API,
    pollEventsUrl = `${MAILGUN_BASE_URL}/events`,
    {
      begin = new Date(),
      end = new Date(2016, 10, 1),
      ascending = 'no',
      limit = 100,
      ...fields
    } = params
    ;
  let
    errors = {},
    events = {},
    eventList = [];
  ;

  events = HTTP.call("GET", pollEventsUrl,
    {
      auth: `api:${MAILGUN_API_KEY}`,
      params: {limit: 2, ...fields}
    });
  // console.log(events)

  return events;
}


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
      mailTemplate = Assets.getText(`email_templates/${template}/${type}.html`);
      break;
    }
    case "digest": {
      mailTemplate = Assets.getText(`email_templates/${template}.html`);
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
      break;
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
 * Function get mail data
 * @param {String} type
 * @param {Object} data
 * @return {Object} base one type
 */
const getMailData = ({type, data}) => {
  let result = {};

  switch (type) {
    case "site": {
      result = {
        siteUrl: `http://${domain}`,
        siteName: SITE_NAME
      };
      break;
    }
    case "leader": {
      const
        {leaderId} = data,
        leader = Accounts.users.findOne({_id: leaderId}, {fields: {username: true, emails: true}}),
        leaderProfile = Profiles.findOne({userId: leaderId}, {fields: {firstName: true, lastName: true}})
        ;
      if (_.isEmpty(leader)) {
        return new Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND, `leader ${leaderId} not found`);
      }
      if (_.isEmpty(leaderProfile)) {
        return new Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND, `leader profile ${leaderId} not found`);
      }
      result = {
        alias: leader.username,
        leaderProfileUrl: `http://${leader.username}.${domain}`,
        leaderName: `${capitalize(leaderProfile.firstName)}`,
        leaderFullName: `${capitalize(leaderProfile.firstName)} ${capitalize(leaderProfile.lastName)}`,
        leaderEmail: leader.emails[0].address
      };
      break;
    }
    case "employee": {
      const
        {employeeId} = data,
        employee = Employees.findOne({_id: employeeId}, {fields: {email: true, firstName: true, lastName: true}})
        ;
      if (_.isEmpty(employee)) {
        return new Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND, `employee ${employeeId} not found`);
      }

      result = {
        employeeName: `${capitalize(employee.firstName)}`,
        employeeFullName: `${capitalize(employee.firstName)} ${capitalize(employee.lastName)}`,
        employeeEmail: employee.email
      };
      break;
    }
    case "organization": {
      const
        {organizationId} = data,
        organization = Organizations.findOne({_id: organizationId}, {fields: {name: true}});
      if (_.isEmpty(organization)) {
        return new Meteor.Error(ERROR_CODE.RESOURCE_NOT_FOUND, `organization ${organizationId} not found`);
      }

      result = {
        orgName: `${capitalize(organization.name)}`
      };
      break;
    }
    default: {
      return new Meteor.Error(`Unknown type: ${type}`);
    }
  }

  return result;
}


/**
 * Function verify the sender email
 * @param {Object} params {type, email, id}
 * @return {Object} {isLeader, isEmployee, message} if email match with the email of the id (id could be leader or employee)
 */
export const verifySenderEmail = ({params}) => {
  const
    {type, email, id} = params
    ;

  switch (type) {
    case "leader": {
      const leader = Accounts.users.findOne({_id: id});
      if (!_.isEmpty(leader)) {
        if (email === leader.emails[0].address) {
          return {isLeader: true};
        } else {
          return {
            isLeader: false,
            message: `sender ${email} doesn't match the leader ${id}`
          };
        }
      } else {
        return {
          isLeader: false,
          message: `leader ${id} doesn't exists.`
        };
      }
      break;
    }
    case "employee": {
      const employee = Employees.findOne({_id: id});
      if (!_.isEmpty(employee)) {
        if (email === employee.email) {
          return {isEmployee: true};
        } else {
          return {
            isEmployee: false,
            message: `sender ${email} doesn't match the employee ${id}`
          };
        }
      } else {
        return {
          isEmployee: false,
          message: `employee ${id} doesn't exists.`
        }
      }
      break;
    }
    default: {
      return {};
    }
  }
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
      html: "",
      tag: "",
      userVariables: {}
    },
    senderSuffix = "",
    subject = "",
    tag = "",
    userVariables = {}
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
      tag = "survey";

      break;
    }
    case "survey_error": {
      mailData.replyGuideHeader = EMAIL_TEMPLATE_CONTENT.employee.metrics.replyGuideHeader;
      mailData.replyGuideMessage = EMAIL_TEMPLATE_CONTENT.employee.metrics.replyGuideMessage;
      mailData.message = `Please help "${mailData.leaderName}" to improve "${mailData.metric}" management by giving accurate score. The score should be a number from 1 to 5. If you think ${mailData.leaderName} is doing a great job, just reply the email by sending 5. If you think ${mailData.leaderName} is doing moderate job reply the email by sending 3 and if ${mailData.leaderName} is doing very bad then send 1.`;
      mailData.description = EMAIL_TEMPLATE_CONTENT.employee.metrics[metric];
      senderSuffix = "survey";
      subject = `${mailData.employeeName}, seems the score of "${mailData.metric}" has some issues.`;
      tag = "scoringError"

      break;
    }
    case "feedback": {
      mailData.replyGuideHeader = EMAIL_TEMPLATE_CONTENT.employee[template].replyGuideHeader;
      mailData.replyGuideMessage = EMAIL_TEMPLATE_CONTENT.employee[template].replyGuideMessage;
      mailData.message = `"${mailData.leaderName}" needs your help to improve "${mailData.metric}" Management.`;
      mailData.description = `Your feedback is very important and it will be kept CONFIDENTIAL, it means ${mailData.leaderName} won’t be able to know who submitted the feedback.`;
      senderSuffix = template;
      subject = `${mailData.employeeName}, "${mailData.leaderName}" wants to improve ${mailData.metric}, how?`;
      tag = "feedbackToLeader";
      break;
    }
    case "thankyou": {
      const {type} = data;
      mailData.message = `I appreciate your contribution on "${mailData.metric}" Management. I believe better leadership can help all of us to enjoy our daily life even more. Besides, it is very effective for you as an individual. The better the leader, happier employee.\nBest Regards,\ntheLeader.io on behalf of "${mailData.leaderName}"`;
      mailData.description = `Your ${type} will help ${mailData.leaderName} to improve.`;
      mailData.viewLeaderProfileHeader = `View ${mailData.leaderName} public profile?`;
      senderSuffix = template;
      subject = `${mailData.employeeName}, You’ve been heard. Leadership matters.`;
      tag = "scoringSuccess";
      break;
    }
  }

  result.subject = subject;
  result.from = `"${mailData.leaderName}" <${planId}-${organizationId}-${senderSuffix}@${mailDomain}>`;
  result.to = employee.email;
  result.html = buildHtml({template, data: mailData});
  result.tag = tag;
  result.userVariables = {template, emailId: `${planId}-${organizationId}`};

  return result;
}

/**
 * Function to collect content data for email to employees
 * @param template
 * @param data
 */
export const getEmployeeEmailOptions = ({template, data}) => {
  const
    {type, employeeId, leaderId, organizationId, feedback} = data,
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
      replyGuideMessage: "",
      delegates: ""
    };

  let
    result = {
      from: "",
      to: "",
      subject: "",
      html: "",
      tag: "",
      userVariables: {}
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

  switch (type) {
    case "feedback": {
      mailData.employeeName = `${capitalize(employee.firstName)} ${capitalize(employee.lastName)}`;
      mailData.orgName = `${capitalize(organization.name)}`;
      mailData.leaderName = `${capitalize(leader.firstName)}`;
      mailData.replyGuideHeader = EMAIL_TEMPLATE_CONTENT.leader[type].replyGuideHeader;
      mailData.replyGuideMessage = EMAIL_TEMPLATE_CONTENT.leader[type].replyGuideMessage;
      mailData.message = `"${mailData.employeeName}" needs your help to improve Performance.`;
      mailData.description = `Your feedback will help ${mailData.employeeName} a lot.`;
      senderSuffix = `${template}-${type}`;
      subject = `How is the performance of "${mailData.employeeName}" in ${mailData.orgName}?`;

      result.subject = subject;
      result.from = `"${mailData.siteName}" <${employeeId}-${organizationId}-${leaderId}-${senderSuffix}@${mailDomain}>`;
      result.to = leaderData.emails[0].address;
      result.tag = "feedbackToEmployee";
      break;
    }
    case "inform_feedback": {
      mailData.employeeName = `${capitalize(employee.firstName)}`;
      mailData.orgName = `${capitalize(organization.name)}`;
      mailData.leaderName = `${capitalize(leader.firstName)} ${capitalize(leader.lastName)}`;
      mailData.message = `This is how "${mailData.leaderName}" evaluated your performance.`;
      mailData.description = feedback;
      mailData.delegates = `theLeader.io, Send on Behalf of "${mailData.leaderName}"`
      subject = `${mailData.employeeName}, "${mailData.leaderName} has a suggestion for you.`;

      result.subject = subject;
      result.from = `"${mailData.siteName}" <no-reply@mail.theleader.io>`;
      result.to = employee.email;
      result.tag = "informFeedbackToEmployee";
      break;
    }
    default: {
      return {message: "Unknown type."}
    }
  }

  result.html = buildHtml({template, data: mailData});
  result.userVariables = {type, template, emailId: `${employeeId}-${organizationId}-${leaderId}`};

  return result;
}

/**
 * Function to collect content data for digest email to leaders
 * @param template
 * @param data
 */
export const getDigestEmailOptions = ({template, data}) => {
  const
    {digest} = data,
    {leaderId} = digest,
    EMAIL_TEMPLATE_CONTENT = getDefaults.call({name: 'EMAIL_TEMPLATE_CONTENT'}).content,
    siteInfo = getMailData({type: "site"}),
    leaderInfo = getMailData({type: "leader", data: {leaderId}}),
    mailData = {
      subject: "",
      leaderName: "",
      siteName: "",
      updateEmployeeList: {
        startDate: new Date()
      },
      sendingPlanStatus: {
        sendFailed: false,
        message: "",
        reason: "",
        suggest: "",
      },
      leadershipProgress: {
        haveProgress: true,
        totalBadScores: 0,
        totalGoodScores: 0,
        totalFeedback: 0,
      },
      orgInfo: {
        haveActiveOrg: false,
        totalEmployees: 0 // in active orgs.
      },
      articles: {
        haveArticles: false,
        metricToImprove: "",
        articles: [
          {
            url: "",
            subject: ""
          }
        ]
      },
      leaderProfileUrl: ""
    }
    ;
  let
    result = {
      from: `"${siteInfo.siteName} weekly" <no-reply@${mailDomain}>`,
      to: "jackiekhuu.work@gmail.com",
      subject: "",
      html: "",
      tag: "",
      userVariables: {}
    }
    ;

  mailData.subject = `${leaderInfo.leaderName}, Here is your leadership progress last week.`;
  mailData.leaderName = leaderInfo.leaderName;
  mailData.siteName = siteInfo.siteName;
  mailData.updateEmployeeList = digest.updateEmployeeList;
  mailData.sendingPlanStatus = digest.sendingPlanStatus;
  mailData.leadershipProgress = digest.leadershipProgress;
  mailData.orgInfo = digest.orgInfo;
  mailData.articles = digest.articles;
  mailData.leaderProfileUrl = leaderInfo.leaderProfileUrl;
  mailData.orgUrl = `http://${leaderInfo.alias}.${domain}/app/organizations`;

  result.subject = mailData.subject;
  result.to = leaderInfo.leaderEmail;
  result.html = buildHtml({template, data: mailData});
  result.tag = "weeklyDigest";
  result.userVariables = {template, emailId: `${leaderId}`};

  return result;

}

/**
 * Function to collect content data for referral email
 * @param template
 * @param data
 */
export const getReferralEmailOptions = ({template, data}) => {
  const
    {email, firstName, leaderName, registerUrl, cancelUrl, leaderId, userId} = data,
    EMAIL_TEMPLATE_CONTENT = getDefaults.call({name: 'EMAIL_TEMPLATE_CONTENT'}).content,
    siteInfo = getMailData({type: "site"}),
    subject = `${firstName}, You're invited to sign up for a leadership tool by ${leaderName}.`,
    mailData = {
      subject,
      userName: firstName,
      leaderName,
      siteName: siteInfo.siteName,
      siteUrl: siteInfo.siteUrl,
      registerUrl,
      cancelUrl,
      message: ""
    };
  let
    result = {
      from: `"${siteInfo.siteName}" <no-reply@${mailDomain}>`,
      to: "jackiekhuu.work@gmail.com",
      subject,
      html: "",
      tag: "",
      userVariables: {}
    };

  mailData.message = `"${leaderName}" was using <strong>theLeader.io</strong> as a useful tool to become a great leader.`;

  result.to = email;
  result.html = buildHtml({template, data: mailData});
  result.tag = "referral";
  result.userVariables = {template, emailId: `${leaderId}-${userId}`};

  return result;
}