AutoForm.hooks({
	insertSurveyForm: {
		onSubmit: function(doc) {
			try {
				var token = Router.current().params.query.token;
				if(!token) return false;
				Meteor.call('submitSurvey', doc, token, function(err, result) {
					if(err) throw err;
					if(result) {
						Router.go('dashboardForEmployee', {}, {query: {token: token }})		
					}
				})	
			} catch(e) {
				debuger(e);
			}
			
			return false;
		}
	}
})
