Template.register.events({
    'submit #register-form': function (event, type) {
        event.preventDefault();
        var email = type.find('#account-email').value,
            name  = type.find('#account-name').value,
            password = type.find('#account-password').value;

        Accounts.createUser({
            email: email,
            password: password,
            profile: {
                name: name
            }
        }, function (error) {
            if(error) {
                //todo error handling
            }

            //todo needs to be refactored
            Meteor.loginWithPassword(email, password, function(error) {
                if(error) {
                    //todo: error handling must be done
                } else {

                }
            });

        });

        return false;
    }
});