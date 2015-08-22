AccountsTemplates.configure({
    // Behavior
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: true,
    sendVerificationEmail: false,
    lowercaseUsername: false,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: false,
    showLabels: true,
    showPlaceholders: true,
    showResendVerificationEmailLink: false,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    privacyUrl: 'privacy',
    termsUrl: 'terms-of-use',

    // Redirects
    homeRoutePath: '/home',
    redirectTimeout: 4000,

    // Hooks
    // onLogoutHook: myLogoutFunc,
    // onSubmitHook: mySubmitFunc,
    // preSignUpHook: myPreSubmitFunc,

    // Texts
    texts: {
        button: {
            signUp: "Register Now!"
        },
        socialSignUp: "Register",
        socialIcons: {
            "meteor-developer": "fa fa-rocket"
        },
        title: {
            forgotPwd: "Recover Your Password"
        },
    },
});

AccountsTemplates.addField({
    _id: 'name',
    type: 'text',
    displayName: "Name"
});

AccountsTemplates.configureRoute('signIn', {
    name: 'login',
    path: '/login',
    template: 'login',
    layoutTemplate: 'blankLayout',
    redirect: function() {
        var user = Meteor.user();
        if (user)
            Router.go('/dashboard');
    }
});

AccountsTemplates.configureRoute('signUp', {
    name: 'register',
    path: '/register',
    layoutTemplate: 'blankLayout',
    action: function() {
        Session.set("requestInviteCompleted", false);
        this.render('register');
    }
});

if (Meteor.isServer) {
    
    // Set up login services
    Meteor.startup(function() {
        // Add Facebook configuration entry
        ServiceConfiguration.configurations.update({
            "service": "facebook"
        }, {
            $set: {
                "appId": "831564623623696",
                "secret": "c40dfd4f25ca77f0c47120b856bda05e"
            }
        }, {
            upsert: true
        });

        // Add Google configuration entry
        ServiceConfiguration.configurations.update({
            "service": "google"
        }, {
            $set: {
                "clientId": "580307750953-hb7qu0spiku75arr6hdcdj5lpklgng6m.apps.googleusercontent.com",
                "secret": "efH4k7i3bv5X9tDE8109XVwD"
            }
        }, {
            upsert: true
        });
    });
}
