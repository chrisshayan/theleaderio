Router.configure({
    layoutTemplate: 'mainLayout',
    notFoundTemplate: 'notFound'

});

//
// Example pages routes
//

Router.route('/pageOne', function () {
    this.render('pageOne');
});

Router.route('/pageTwo', function () {
    this.render('pageTwo');
});

//
// Landing page
//

Router.route('/landing', function () {
    this.render('landing');
    this.layout('blankLayout')
});

Router.route('/', function () {
    Router.go('landing');
});

