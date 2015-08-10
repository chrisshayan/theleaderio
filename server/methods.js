var apis = {};
apis.checkEmployeeExists = function(email) {
	if(!this.userId) return false;
	check(email, String);
	var criteria = {
		email: email,
		createdAt: this.userId
	}
	return Collections.Employees.find(criteria, {limit: 1}).count() === 1;
}

apis.grantEmployeeAccessToken = function() {
	if(!this.userId) return false;
	this.unblock();
	var currentUser = Meteor.user();
	var employees = Collections.Employees.find({createdBy: this.userId}).fetch();
	_.each(employees, function(employee) {
		var token = IZToken.generate(employee, 24*60*60);
		if(!token) return;
		var link = Meteor.absoluteUrl("verify-invitation/" + token);

		var fromEmail = false;
		if(currentUser.emails)
			fromEmail = currentUser.emails[0].address;
		else if(currentUser.services.facebook.email)
			fromEmail = currentUser.services.facebook.email;
		else if(currentUser.services.google.email)
			fromEmail = currentUser.services.google.email;
		if(!fromEmail) return;

		var mail = {
			from: currentUser.profile.name + " <" + fromEmail + ">",
			to: employee.email,
			subject: currentUser.profile.name + " from teamleader.io need your survey",
			text: link
		}
		Email.send(mail);
	});	
}

apis.verifyLinkInvitation = function(token) {
	check(token, String);
	var result = IZToken.verify(token);
	if(result.success) {
		result.data = IZToken.getData(token);
	}
	return result;
}

apis.submitSurvey = function(survey, token) {
	check(survey, Object);
	check(token, String);

	var result = IZToken.verify(token);
	if(result.success) {
		survey.employee = IZToken.getData(token);
		delete survey.employee['leaderId'];
		console.log(survey)
		return Collections.Surveys.insert(survey);
	} else {
		return false;
	}
}

Meteor.methods(apis);