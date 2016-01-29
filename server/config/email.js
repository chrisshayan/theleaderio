Meteor.startup(function () {
	const mailConfigure = Meteor.settings.email || {};

	if(Meteor.settings.appName) {
		Accounts.emailTemplates.siteName = Meteor.settings.appName;
	}

	if (mailConfigure.smtp) {
		const {server, port, username, password} = mailConfigure.smtp;
		process.env.MAIL_URL = `smtp://${username}:${password}@${server}:${port}`;
	}

	if(mailConfigure.emails && mailConfigure.emails['no-reply']) {
		Accounts.emailTemplates.from = mailConfigure.emails['no-reply'];
	}
});
