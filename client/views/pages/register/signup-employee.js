AutoForm.hooks({
    signupEmployeeForm: {
        onSubmit: function(doc) {
        	var self = this;
            var token = Router.current().params.token;
            Meteor.call("signupEmployee", doc, token, function(err, userId) {
                if (err) throw err;
                if (userId) {
                    Meteor.loginWithPassword({id: userId}, doc.password);
                }
            });
            
            return false;
        }
    }
})
