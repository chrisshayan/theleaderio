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

apis.verifyToken = function (token) {
    check(token, String);
    var result = IZToken.verify(token);
    if (result.success) {
        data = IZToken.getData(token);
        result.data = _.pick(data, 'firstName', 'lastName', 'email', 'headline');
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
    if (!userId)
        userId = this.userId;
    var data = Collections.Surveys.aggregate(
        [
            {$match: {leaderId: userId}},
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
checkIsAdmin = function (userId) {
    if (!userId) return false;
    return Roles.userIsInRole(userId, [ROLE.ADMIN]);
}

checkIsLeader = function (userId) {
    if (!userId) return false;
    return Roles.userIsInRole(userId, [ROLE.LEADER]);
}
//====================================================//
apis.sendLeaderInvitation = function (requestId) {
    if (!checkIsAdmin(this.userId)) return new Meteor.Error(403, "You don't have permission");
    check(requestId, String);
    try {
        var self = this;
        var invitee = Collections.LeaderRequests.findOne({_id: requestId});
        if (!invitee) return false;
        Meteor.defer(function () {
            var token = IZToken.generate(invitee, 24 * 60 * 60);
            if (!token) return;
            var inviter = Meteor.users.findOne({_id: self.userId});
            var leaderName = inviter.profile.firstName;
            var inviteeName = invitee.firstName;
            var link = Meteor.absoluteUrl("signup-leader/" + token);
            var params = {leaderName: leaderName, invitee: inviteeName, confirmationUrl: link};
            var html = Utils.compileServerTemplate("leadershipInvitationEmail", 'mailtemplates/leadership-invitation-email.html', params)
            var mail = {
                from: inviter.defaultEmail(),
                to: invitee.email,
                subject: leaderName + " has invited you to use theLeader.io",
                html: html
            }
            Email.send(mail);
            Collections.LeaderRequests.update({_id: requestId}, {$set: {status: 2}});
        });
    } catch (e) {
        console.log(e);
        return false;
    }
    return true;
}

apis.signupLeader = function (data, token) {
    check(data, {
        firstName: String,
        lastName: Match.Optional(String),
        industries: [String],
        password: String,
        repassword: String,
        email: Match.Optional(String),
        headline: Match.Optional(String),
    });
    check(token, String);

    try {
        var checkToken = IZToken.verify(token);
        if (!checkToken.success)
            return new Meteor.Error(403, "You don't have permission to access this page");
        var invitee = IZToken.getData(token);
        var accountInfo = {
            email: invitee.email,
            password: data.password,
            profile: {
                firstName: data.firstName,
                lastName: data.lastName,
                industries: data.industries,
                headline: data.headline || ""
            }
        };
        var userId = Accounts.createUser(accountInfo);
        if (userId) {
            Roles.addUsersToRoles(userId, [ROLE.LEADER]);
            //  update request status
            Collections.LeaderRequests.update({_id: invitee._id}, {$set: {status: 3}})
        }
        return userId;
    } catch (e) {
        console.log(e);
        return false;
    }
}

apis.sendEmployeeInvitations = function (requestIds) {
    if (!this.userId || !checkIsLeader(this.userId)) return false;
    if (requestIds) {
        check(requestIds, [String]);
        var requests = Collections.EmployeeRequests.find({
            _id: {$in: requestIds},
            status: {$ne: 3},
            createdBy: this.userId
        });
        if (requests.count() <= 0) return true;
    } else {
        // send all new requests
        var requests = Collections.EmployeeRequests.find({status: 1, createdBy: this.userId});
        if (requests.count() <= 0) return true;
    }
    var self = this;
    Meteor.defer(function () {
        var inviter = Meteor.users.findOne({_id: self.userId});
        _.each(requests.fetch(), function (request) {
            var token = IZToken.generate(request, 24 * 60 * 60);
            if (!token) return;
            var leaderName = inviter.profile.firstName;
            var employeeName = request.firstName;
            var link = Meteor.absoluteUrl("signup-employee/" + token);
            var params = {leaderName: leaderName, employeeName: employeeName, confirmationUrl: link};
            var html = Utils.compileServerTemplate("employeeInvitationEmail", 'mailtemplates/employee-invitation-email.html', params)
            var mail = {
                from: inviter.defaultEmail(),
                to: request.email,
                subject: leaderName + " has invited you to help him to improve his leadership",
                html: html
            }
            Email.send(mail);
            Collections.EmployeeRequests.update({_id: request._id}, {$set: {status: 2}});
        });
    });
    return true;
}


apis.signupEmployee = function (data, token) {
    check(data, {
        firstName: String,
        lastName: Match.Optional(String),
        password: String,
        repassword: String,
        email: Match.Optional(String)
    });
    check(token, String);
    try {
        var checkToken = IZToken.verify(token);
        if (!checkToken.success)
            return new Meteor.Error(403, "You don't have permission to access this page");
        var invitee = IZToken.getData(token);
        var accountInfo = {
            email: invitee.email,
            password: data.password,
            profile: {
                firstName: data.firstName,
                lastName: data.lastName
            }
        };
        var userId = Accounts.createUser(accountInfo);
        if (userId) {
            Roles.addUsersToRoles(userId, [ROLE.EMPLOYEE]);
            //  update request status
            Collections.EmployeeRequests.update({_id: invitee._id}, {$set: {status: 3}})
            Collections.Relationships.insert({
                type: 1,
                userId: invitee.createdBy,
                elseId: userId,
                createdAt: new Date()
            });
        }
        return userId;
    } catch (e) {
        console.log(e);
        return false;
    }
};

apis.feedbackCounter = function () {
    if (!this.userId) return {};
    var positiveCount = Collections.Feedbacks.find({leaderId: this.userId, point: {$gt: 0}}).count();
    var negativeCount = Collections.Feedbacks.find({leaderId: this.userId, point: {$lte: 0}}).count();
    var total = positiveCount + negativeCount;
    return {
        positive: positiveCount,
        negative: negativeCount,
        positivePercent: (positiveCount / total) * 100,
        negativePercent: (negativeCount / total) * 100
    }
};

apis.pointsLastSixMonths = function () {
    var now = new Date();
    var sixMonthsFromNow = new Date(now.setMonth(now.getMonth() - 6));
    var result = Collections.Surveys.aggregate([
        {
            $match: {
                "leaderId": this.userId,
                $and: [
                    {"createdAt": {$gte: sixMonthsFromNow}},
                    {"createdAt": {$lt: new Date()}}
                ]

            }
        },
        {
            $group: {
                _id: {
                    year: {
                        $year: "$createdAt"
                    },
                    month: {
                        $month: "$createdAt"
                    },
                },
                score: {
                    $avg: "$overall"
                }
            }
        }
    ]);

    var report = [];
    var now = moment(new Date());
    report.push({
        time: now.format("YYYYMM"),
        year: now.format("YYYY"),
        month: now.format("MM"),
        score: 0
    });

    _.each(_.range(1,6), function(m) {
        var d = now.clone().subtract(m, 'month');

        var score = _.findWhere(result, {year: m.year, month: m.month});

        report.push({
            time: d.format("YYYYMM"),
            year: d.format("YYYY"),
            month: d.format("MM"),
            score: score ? score.score : 0
        });
    });

    report = _.sortByOrder(report, ['time'], ['asc']);
    return report;
};

apis.publishPost = function(data) {
    if(!this.userId) return false;
    this.unblock();
    check(data, {
        title: String,
        content: String,
        tags: Match.Optional([String]),
        picture: Match.Optional(String),
    });

    var result = true;

    var postId = Collections.Posts.insert({
        title: data.title,
        slug: slugify(data.title),
        content: data.content,
        tags: data.tags,
        createdAt: new Date(),
        createdBy: this.userId
    });


    if(postId) {
        Meteor.defer(function() {
            if(postId && data.picture) {
                Collections.Images.insert(data.picture, function (err, fileObj) {
                    if(err) throw err;
                    Collections.Posts.update({_id: postId}, {$set: {picture: fileObj._id}});
                });
            }
        });
        return Collections.Posts.findOne({_id: postId}, {fields: {_id: 1, slug: 1}});
    }

    return false;
};

Meteor.methods(apis);