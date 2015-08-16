AutoForm.hooks({
    signupLeaderForm: {
        onSubmit: function(doc) {
        	var self = this;
            var token = Router.current().params.token;
            Meteor.call("signupLeader", doc, token, function(err, userId) {
                if (err) throw err;
                if (userId) {

                    Meteor.loginWithPassword({id: userId}, doc.password);
                    self.done();
                }
            });
            
            return false;
        }
    }
})
