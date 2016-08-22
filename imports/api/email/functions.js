import emailTemplateBuilder from 'email-template-builder';


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
