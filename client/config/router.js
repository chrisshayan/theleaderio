var redirectToDashboard = function() {
    if(Meteor.userId()) {
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
Router.onBeforeAction(function () {
    if (!Meteor.userId() || Meteor.loggingIn()) {
        this.redirect('login')
    } else {
        this.next();
    }
}, {
    except: ['landing', 'login', 'register']
});

/**
 * redirect to dashboard after login
 */
Router.onBeforeAction(redirectToDashboard, {only: ['login', 'register', 'landing']});

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

Router.route('/register', {
    name: "register",
    action: function () {
        this.layout('blankLayout')
        this.render('register');
    }
});

Router.route('/login', {
    name: "login",
    action: function () {
        this.layout('blankLayout')
        this.render('login');
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
        this.render('dashboard');
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

Router.route('/kudobox', {
    name: "kudobox",
    fastRender: true,
    action: function () {
        this.render('kudobox');
    }
});

