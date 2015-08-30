var redirectToDashboard = function () {
    if (Meteor.isClient) {
        if (Meteor.userId()) {
            Router.go('dashboard');
        }
    }
    this.next();
};

Router.configure({
    layoutTemplate: 'mainLayout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'waveLoading'
});

/**
 * Check if user is login
 */
Router.onBeforeAction(function () {
    if (Meteor.isClient) {
        if (!Meteor.userId() || Meteor.loggingIn()) {
            this.redirect('login')
        }
    }
    this.next();
}, {
    except: ['landing', 'login', 'register', 'signupLeader', 'signupEmployee', 'tokenError']
});

/**
 * redirect to dashboard after login
 */
Router.onBeforeAction(redirectToDashboard, {
    only: ['login', 'signupLeader', 'signupEmployee']
});

//
// Landing page
//

Router.route('/', {
    name: "landing",
    action: function () {
        this.layout('blankLayout')
        this.render('landing');
    }
});

Router.route('/logout', {
    name: "logout",
    action: function () {
        Meteor.logout();
    }
});

Router.route('/dashboard', {
    name: "dashboard",
    fastRender: true,
    action: function () {
        var user = Meteor.user();
        if (user.isAdmin()) {
            this.layout("blankLayout");
            this.render('admin');
        } else if (user && user.isLeader()) {
            this.render('dashboard');
        } else {
            this.layout("blankLayout");
            this.render('leaderProfile');
        }
    }
});

Router.route('/measure', {
    name: "measure",
    fastRender: true,
    action: function () {
        this.render('measure');
    }
});

Router.route('/employees', {
    name: "employees",
    fastRender: true,
    action: function () {
        this.render('employees');
    }
});

Router.route('/employees/add', {
    name: "addEmployee",
    fastRender: true,
    action: function () {
        this.render('employee');
    },
    data: function () {
        return {
            doc: null,
            type: 'insert',
            title: 'Add employee'
        }
    }
});

Router.route('/employees/update/:_id', {
    name: "updateEmployee",
    fastRender: true,
    waitOn: function () {
        return [
            Meteor.subscribe('employeeDetails', this.params._id)
        ];
    },
    action: function () {
        this.render('employee');
    },
    data: function () {
        return {
            doc: Collections.Employees.findOne(this.params._id),
            type: 'update',
            title: 'Update employee'
        }
    }
});

Router.route('/kudobox', {
    name: "kudobox",
    fastRender: true,
    action: function () {
        this.render('kudobox');
    }
});

// Profile customize for user login
Router.route('/profile', {
    name: "profile",
    fastRender: true,
    action: function () {
        this.render('profile');
    }
});
// Profile for employee
Router.route('/employee/:_id', {
    name: "employeeProfile",
    fastRender: true,
    action: function () {
        this.render('profile');
    }
});

Router.route('/verify-invitation/:token', {
    name: 'verifyLinkInvitation',
    where: 'server',
    action: function () {
        var self = this;
        try {
            Meteor.call('verifyLinkInvitation', this.params.token, function (err, result) {
                if (err) throw err;
                if (result.success === true) {
                    var url = Meteor.absoluteUrl("survey/" + self.params.token);
                    self.response.writeHead(301, {
                        Location: url
                    });
                    self.response.end();
                } else {
                    self.response.end();
                }
            });
        } catch (e) {
            console.log(e);
            self.response.end();
        }
    }
});

Router.route("/verify-invitation-failed", {
    name: 'verifyInvitationFailed',
    action: function () {

    }
});

Router.route("/leader/:token", {
    name: 'dashboardForEmployee',
    action: function () {
        this.render('dashboard');
    }
});

Router.route("/survey/:token", {
    name: 'survey',
    action: function () {
        this.render('survey');
    }
});


//==================================================//
// ADMIN ROUTES                                 
//==================================================//

Router.onBeforeAction(function () {
    var isAdmin = Roles.userIsInRole(Meteor.user(), [ROLE.ADMIN]);
    if (!isAdmin) {
        Router.go("/");
    }
    this.next();
}, {
    only: ["adminPanel"]
});

Router.route('/token-error', {
    name: "tokenError",
    layoutTemplate: 'blankLayout',
    template: "tokenError"
})

Router.route('/admin', {
    name: "adminPanel",
    layoutTemplate: "blankLayout",
    action: function () {
        this.render("admin")
    }
});

function checkLeaderToken() {
    var self = this;
    Meteor.call('verifyToken', self.params.token, function (err, result) {
        if (err) throw err;
        if (result.success) {
            Session.set("leaderInvitationData", result.data);
        } else {
            Router.go("tokenError");
        }
    });
    this.next();
}

function checkEmployeeToken() {
    var self = this;
    Meteor.call('verifyToken', self.params.token, function (err, result) {
        if (err) throw err;
        if (result.success) {
            Session.set("employeeInvitationData", result.data);
        } else {
            Router.go("tokenError");
        }
    });
    this.next();
}

Router.route("/signup-leader/:token", {
    name: "signupLeader",
    layoutTemplate: "blankLayout",
    onBeforeAction: checkLeaderToken,
    template: "signupLeader",
    waitOn: function () {
        return [
            Meteor.subscribe("industries")
        ];
    }
});

Router.route("/signup-employee/:token", {
    name: "signupEmployee",
    layoutTemplate: "blankLayout",
    onBeforeAction: checkEmployeeToken,
    template: "signupEmployee"
});


Router.route("/feedbacks", {
    name: "feedbacks",
    template: "myFeedbacks"
});