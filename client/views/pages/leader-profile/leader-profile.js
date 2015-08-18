 AutoForm.hooks({
     sendFeedbackForm: {
         onSuccess: function() {
             //AutoForm.resetForm("sendFeedbackForm")
             Router.go('dashboard');
             toastr.success("Send feedback successful");
         }
     },
     takeSurveyForm: {
         onSuccess: function() {
             Router.go('dashboard');
             toastr.success("Send survey successful");
         }
     },
 });

Template.leaderProfile.onCreated(function() {
	var instance = Template.instance();
    instance.isLoading = new ReactiveVar(true);
	instance.action = new ReactiveVar("");

	instance.autorun(function() {
		instance.sub = Meteor.subscribe("employeeDashboard", {
            onReady: function() {
                instance.isLoading.set(false);
            }
        });

        var params = Router.current().params;
        if(params.query.hasOwnProperty("action")) {
            var action = params.query.action.toLowerCase();
            instance.action.set(action);
        } else {
            $(".modal").remove();
            $('.modal-backdrop').remove();
            instance.action.set("");
        }
	});
});

Template.leaderProfile.onDestroyed(function() {
    var instance = Template.instance();
    instance.sub.stop();
});


Template.leaderProfile.rendered = function(){

    // Set options for peity charts
    $(".line").peity("line",{
        fill: '#1ab394',
        stroke:'#169c81'
    })

    $(".bar").peity("bar", {
        fill: ["#1ab394", "#d7d7d7"]
    })

};

Template.leaderProfile.helpers({
    isLoading: function() {
        return Template.instance().isLoading.get();
    },
    leader: function() {
        return Meteor.user().leader();
    },

    isAction: function(action) {
        return Template.instance().action.get() == action;
    }
});




Template.sendFeedbackModal.onRendered(function() {
    $("#sendFeedbackModal").modal("show");
    $("#sendFeedbackModal").on('hidden.bs.modal', function () {
        $(this).data('bs.modal', null);
    });
});

Template.takeSurveyModal.onRendered(function() {
    $("#takeSurveyModal").modal("show");
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green'
    });
});
