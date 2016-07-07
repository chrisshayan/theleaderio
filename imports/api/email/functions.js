import emailTemplateBuilder from 'email-template-builder';


export const get = function ({ templateName, firstName, url, alias }) {
  const template = Assets.getText(`email_templates/${templateName}.html`);
  const data = {
    firstName: firstName,
    url: url,
    alias: alias
  };
  console.log(`data: templateName: ${templateName}, firstName: ${firstName}, url: ${url}, alias: ${alias}`);
  //Generate e-mail with data
  return emailTemplateBuilder.generate(data, template);
}
