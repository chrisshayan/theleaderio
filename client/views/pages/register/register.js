Session.set("requestInviteCompleted", false);

AutoForm.hooks({
    requestInvitationForm: {
        onSuccess: function() {
            Session.set("requestInviteCompleted", true);
        }
    }
});

Template.register.helpers({
    isCompleted: function() {
        return Session.get("requestInviteCompleted");
    }
})