import emailTemplateBuilder from 'email-template-builder';

// collections

import {SendingPlans} from '/imports/api/sending_plans/index';
import {Employees} from '/imports/api/employees/index';

/**
 *
 * @param templateName
 * @param firstName
 * @param url
 * @param alias
 * @returns {*}
 */
export const get = function ({ templateName, firstName, url, alias }) {
  const template = Assets.getText(`email_templates/${templateName}.html`);
  const data = {
    firstName: firstName,
    url: url,
    alias: alias
  };
  // console.log(`data: templateName: ${templateName}, firstName: ${firstName}, url: ${url}, alias: ${alias}`);
  //Generate e-mail with data
  return emailTemplateBuilder.generate(data, template);
}

/**
 * Generate html with template and data
 * @param template
 * @param data
 * @returns {*}
 */
export const buildHtml = function({template, data})  {
  switch(template) {
    case "survey": {
      const mailTemplate = Assets.getText(`email_templates/metrics/${template}.html`);
      return emailTemplateBuilder.generate(data, mailTemplate);
    }
    case "survey_error": {
      const mailTemplate = Assets.getText(`email_templates/metrics/${template}.html`);
      return emailTemplateBuilder.generate(data, mailTemplate);
    }
    case "feedback": {
      const mailTemplate = Assets.getText(`email_templates/metrics/${template}.html`);
      return emailTemplateBuilder.generate(data, mailTemplate);
    }
    case "thankyou": {
      const mailTemplate = Assets.getText(`email_templates/metrics/${template}.html`);
      return emailTemplateBuilder.generate(data, mailTemplate);
    }
    default: {
      const template = Assets.getText(`email_templates/${templateName}.html`);
      const data = {
        firstName: firstName,
        url: url,
        alias: alias
      };
      // console.log(`data: templateName: ${templateName}, firstName: ${firstName}, url: ${url}, alias: ${alias}`);
      //Generate e-mail with data
      return emailTemplateBuilder.generate(data, template);
    }
  }
}

/**
 * get the recipient information
 * @param recipient
 * @param sender
 * @returns {*}
 */
export const  getRecipientInfo = ({recipient, sender}) => {
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