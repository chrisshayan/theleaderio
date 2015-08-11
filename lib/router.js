var redirectToDashboard = function() {
    if (Meteor.userId()) {
        Router.go('dashboard');
        this.next();
    } else {
        this.next();
    }
};

Router.configure({
    layoutTemplate: 'mainLayout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'waveLoading'
});


/**
 * Check if user is login
 */
Router.onBeforeAction(function() {
    if (!Meteor.userId() || Meteor.loggingIn()) {
        this.redirect('login')
    } else {
        this.next();
    }
}, {
    except: ['landing', 'login', 'register', 'verifyLinkInvitation', 'dashboardForEmployee', 'survey']
});

/**
 * redirect to dashboard after login
 */
Router.onBeforeAction(redirectToDashboard, {
    only: ['login', 'register', 'landing', 'verifyLinkInvitation', 'survey']
});

//
// Landing page
//

Router.route('/', {
    name: "landing",
    action: function() {
        this.layout('blankLayout')
        this.render('landing');
    }
});

Router.route('/logout', {
    name: "logout",
    action: function() {
        Meteor.logout();
    }
});

Router.route('/dashboard', {
    name: "dashboard",
    fastRender: true,
    action: function() {
        this.render('dashboard');
    }
});

Router.route('/measure', {
    name: "measure",
    fastRender: true,
    action: function() {
        this.render('measure');
    }
});

Router.route('/employees', {
    name: "employees",
    fastRender: true,
    action: function() {
        this.render('employees');
    }
});

Router.route('/employees/add', {
    name: "addEmployee",
    fastRender: true,
    action: function() {
        this.render('employee');
    },
    data: function() {
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
    waitOn: function() {
        return [
            Meteor.subscribe('employeeDetails', this.params._id)
        ];
    },
    action: function() {
        this.render('employee');
    },
    data: function() {
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
    action: function() {
        this.render('kudobox');
    }
});

// Profile customize for user login
Router.route('/profile', {
    name: "profile",
    fastRender: true,
    action: function() {
        this.render('profile');
    }
});
// Profile for employee
Router.route('/employee/:_id', {
    name: "employeeProfile",
    fastRender: true,
    action: function() {
        this.render('profile');
    }
});

Router.route('/restful', {where: 'server'})
  .get(function () {
    this.response.end('get request\n');
  })

Router.route('/verify-invitation/:token',{
    name: 'verifyLinkInvitation',
    action: function() {
        var self = this;
        Meteor.call('verifyLinkInvitation', this.params.token, function(err, result) {
            if(err) throw err;
            if(result.success === true) {
                Session.set('currentEmployee', result.data);
                Router.go('survey', {token: self.params.token});
            } else {
                Router.go('verifyInvitationFailed');
            }
        });
    }
});

Router.route("/verify-invitation-failed", {
    name: 'verifyInvitationFailed',
    action: function() {

    }
});

Router.route("/leader/:token", {
    name: 'dashboardForEmployee',
    action: function() {
        this.render('dashboard');
    }
});

Router.route("/survey/:token", {
    name: 'survey',
    action: function() {
        this.render('survey');
    }
});