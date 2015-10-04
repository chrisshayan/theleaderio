/**
 * Cache subscriptions
 */
EmployeeCache = new SubsManager({cacheLimit: 100, expireIn: 500});
FriendCache = new SubsManager({cacheLimit: 500, expireIn: 500});
FeedCache = new SubsManager({cacheLimit: 500, expireIn: 500});
SubsCache = new SubsManager();

var redirectToDashboard = function () {
    if (Meteor.isClient) {
        if (Meteor.userId()) {
            Router.go('dashboard');
        }
    }
    this.next();
};

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

Router.configure({
    layoutTemplate: 'mainLayout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'waveLoading'
});

/**
 * Check if user is login
 */
Router.onBeforeAction(function () {
    if (!Meteor.userId() || Meteor.loggingIn()) {
        this.render(null);
        this.redirect('login');
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
        Router.go('login');
    }
});

Router.route('/measure', {
    name: "measure",
    fastRender: true,
    action: function () {
        this.render('measure');
    }
});


Router.route('/edit-profile', {
    name: "editProfile",
    fastRender: true,
    waitOn: function () {
        return [
            Meteor.subscribe('industries')
        ];
    },
    action: function () {
        this.render('editProfile');
    },
    data: function () {
        return Meteor.profiles.findOne({userId: Meteor.userId()})
    }
});

Router.route('/employees', {
    name: "employees",
    fastRender: true,
    waitOn: function() {
        return EmployeeCache.subscribe('employees');
    },
    action: function () {
        this.render('EmployeesPage');
    }
});

Router.route('/add-employee', {
    name: "addEmployee",
    fastRender: true,
    action: function () {
        this.render('addEmployees');
    }
});


Router.route('/friends', {
    name: "friends",
    fastRender: true,
    waitOn: function() {
        return EmployeeCache.subscribe('friends');
    },
    action: function () {
        this.render('FriendsPage');
    }
});


Router.route('/feedback', {
    name: "feedback",
    fastRender: true,
    action: function () {
        this.render('FeedbackPage');
    }
});

Router.route('/dashboard', {
    name: "dashboard",
    fastRender: true,
    waitOn: function () {
        var user = Meteor.user();
        if (!user) return [];
        if (!user.isLeader()) {
            return [SubsCache.subscribe('employeeDashboard')]
        }
    },
    action: function () {
        var user = Meteor.user();
        if (!user) return;
        if (user.isLeader())
            this.render('dashboard');
        else
            this.render('EmployeeDashboard');

        if (user.isAdmin()) {
            this.layout("blankLayout");
            this.render('admin');
        }
    }
});

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

Router.route("/take-survey", {
    name: 'TakeSurvey',
    waitOn: function() {
        return [SubsCache.subscribe('employeeDashboard')];
    },
    template: 'TakeSurvey'
});



