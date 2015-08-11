Session.set("surveyCompleted", false);

AutoForm.hooks({
    insertSurveyForm: {
        onSubmit: function(doc) {
            var token = Router.current().params.token;
            if (!token) return false;
            Meteor.call('submitSurvey', {
                survey: doc,
                token: token
            }, function(err, result) {
                if (err) throw err;

                if (result) {
                    AutoForm.resetForm("insertSurveyForm");
                    Session.set("surveyCompleted", true);
                }
            })
            return false;
        }
    }
});

Template.survey.onRendered(function() {
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green'
    });
});

Template.survey.helpers({
    isCompleted: function() {
        return Session.get("surveyCompleted");
    },
    leaderDashboardUrl: function() {
    	var token = Router.current().params.token;
    	return Router.url('dashboardForEmployee', {token: token});
    }
})
