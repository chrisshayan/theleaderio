

AutoForm.hooks({
    sendFeedbackForm: {
        onSuccess: function () {
            //AutoForm.resetForm("sendFeedbackForm")
            Router.go('dashboard');
            toastr.success("Send feedback successful");

            analytics.track('Send Feedback', {
                category: 'Employee:' + Meteor.userId(),
                label: 'Leader:' + Meteor.user().leader()._id
            });
        }
    }
});

Template.EmployeeDashboard.onCreated(function () {
    var instance = Template.instance();
    instance.action = new ReactiveVar("");

    instance.autorun(function () {

        var params = Router.current().params;
        if (params.query.hasOwnProperty("action")) {
            var action = params.query.action.toLowerCase();
            instance.action.set(action);
        } else {
            $(".modal").remove();
            $('.modal-backdrop').remove();
            instance.action.set("");
        }
    });
});

Template.EmployeeDashboard.helpers({
    isAction: function (action) {
        return Template.instance().action.get() == action;
    }
})


Template.sendFeedbackModal.onRendered(function () {
    $("#sendFeedbackModal").modal("show");
    $("#sendFeedbackModal").on('hidden.bs.modal', function () {
        $(this).data('bs.modal', null);
    });
});
