var apis = {};
apis.checkEmployeeExists = function (email) {
    if (!this.userId) return false;
    check(email, String);
    var criteria = {
        email: email,
        createdAt: this.userId
    }
    return Collections.Employees.find(criteria, {limit: 1}).count() === 1;
}

apis.grantEmployeeAccessToken = function () {
    if (!this.userId) return false;
    this.unblock();
    var currentUser = Meteor.user();
    var employees = Collections.Employees.find({createdBy: this.userId}).fetch();
    _.each(employees, function (employee) {
        var token = IZToken.generate(employee, 24 * 60 * 60);
        if (!token) return;
        var link = Meteor.absoluteUrl("verify-invitation/" + token);

    var fromEmail = false;
        if(currentUser.emails)
            fromEmail = currentUser.emails[0].address;
        else if(currentUser.services.facebook.email)
            fromEmail = currentUser.services.facebook.email;
        else if(currentUser.services.google.email)
            fromEmail = currentUser.services.google.email;
        if(!fromEmail) return;
        var params = {leaderName: currentUser.profile.name, employeeName: employee.name, confirmLink: link};
        var html = Utils.compileServerTemplate("employeeInvitationEmail", 'mailtemplates/employee-invitation-email.html', params)
        var mail = {
            from: currentUser.profile.name + " <" + fromEmail + ">",
            to: employee.email,
            subject: currentUser.profile.name + " from teamleader.io need your survey",
            html: html
        }
        Email.send(mail);
    }); 
}

apis.verifyLinkInvitation = function (token) {
    check(token, String);
    var result = IZToken.verify(token);
    if (result.success) {
        result.data = IZToken.getData(token);
    }
    return result;
}

apis.submitSurvey = function (data) {
    check(data, {
        survey: Object,
        token: String
    });

    var result = IZToken.verify(data.token);
    if (result.success) {
        data.survey.employee = IZToken.getData(data.token);
        return Collections.Surveys.insert(data.survey);
    }
    return false;
}

apis.avgPoints = function (userId) {
    var data = Collections.Surveys.aggregate(
        [
            {$match: {"employee.createdBy": userId}},
            {
                $group: {
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
    if (data.length <= 0) return false;
    return data[0];
}

apis.avgPointsWithToken = function (token) {
    check(token, String);
    var checkToken = IZToken.verify(token);
    if (!checkToken.success)
        return new Meteor.Error(403, "You don't have permission to access this page");
    var employee = IZToken.getData(token);
    var data = Collections.Surveys.aggregate(
        [
            {$match: {"employee.createdBy": employee.createdBy}},
            {
                $group: {
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
    if (data.length <= 0) return false;
    return data[0];
}

apis.addFeedback = function (data) {
    check(data, {
        type: String,
        content: String,
        token: String
    });
    var checkToken = IZToken.verify(data.token);
    if (!checkToken.success)
        return new Meteor.Error(403, "You don't have permission to access this page");
    var employee = IZToken.getData(data.token);
    return Collections.Feedbacks.insert({
        type: data.type,
        content: data.content,
        leaderId: employee.createdBy,
        createdAt: new Date()
    });
}
checkIsAdmin = function(userId) {
	if(!userId) return false;
	return Roles.userIsInRole(userId, [ROLE.ADMIN]);
}
//====================================================//
apis.sendLeaderInvitation = function(requestId) {
	if(!checkIsAdmin(this.userId)) return new Meteor.Error(403, "You don't have permission");	
	check(requestId, String);
	try {
		var self = this;
		var request = Collections.LeaderRequests.findOne({_id: requestId});
		if(!request) return false;
		Meteor.defer(function() {
			var token = IZToken.generate(request, 24*60*60);
			if(!token) return;
			var currentUser = Meteor.users.findOne({_id: self.userId});

			var link = Meteor.absoluteUrl("signup-leader/" + token);
			var params = {leaderName: request.firstName, signupLink: link};
			var html = Utils.compileServerTemplate("employeeInvitationEmail", 'mailtemplates/employee-invitation-email.html', params)
			var mail = {
				from: currentUser.defaultEmail(),
				to: request.email,
				subject: "Signup leader",
				html: html
			}
			Email.send(mail);
			Collections.LeaderRequests.update({_id: requestId},{$set: {status: 2}});
		});
	} catch (e) {
		console.log(e);
		return false;
	}
	return true;
}

Meteor.methods(apis);