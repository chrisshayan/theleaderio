import emailTemplateBuilder from 'email-template-builder';


export const get = function ({ templateName, firstName, url }) {
  const template = Assets.getText(`email_templates/${templateName}.html`);
  const data = {
    firstName: firstName,
    url: url
  };
  //Generate e-mail with data
  return emailTemplateBuilder.generate(data, template);
}
