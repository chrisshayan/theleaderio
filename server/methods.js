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

apis.submitSurvey = function(data) {
	check(data, {
		survey: Object,
		token: String
	});

	var result = IZToken.verify(data.token);
	if(result.success) {
		data.survey.employee = IZToken.getData(data.token);
		return Collections.Surveys.insert(data.survey);
	}
	return false;
}

apis.avgPoints = function(userId) {
	var data = Collections.Surveys.aggregate(
	   [
	   	{$match : {"employee.createdBy": userId}},
	     {
	       $group:
	         {
	           _id: "$employee.createdBy",
	            goalRating: {$avg: "$goalRating"},
	            meetingRating: {$avg: "$meetingRating"},
	            groundRulesRating: {$avg: "$groundRulesRating"},
	            communicationRating: {$avg: "$communicationRating"},
	            leadershipRating: {$avg: "$leadershipRating"},
	            workloadRating: {$avg: "$workloadRating"},
	            energyRating: {$avg: "$energyRating"},
	            stressRating: {$avg: "$stressRating"},
	            decisionRating: {$avg: "$decisionRating"},
	            respectRating: {$avg: "$respectRating"},
	            conflictRating: {$avg: "$conflictRating"}
	         }
	     }
	   ]
	);
	if(data.length <= 0) return false;
	return data[0];
}

Meteor.methods(apis);