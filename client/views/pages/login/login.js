Template.login.events({
    'submit #login-form' : function (event, type) {
        event.preventDefault();
        var email = type.find('#account-email').value,
            password = type.find('#account-password').value;

        Meteor.loginWithPassword(email, password, function(error) {
            console.log(error);
            if(error) {
                //todo: error handling must be done
            } else {

            }
        });

        return false;
    }
});