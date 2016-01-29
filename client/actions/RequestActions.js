RequestActions = {
	accept(requestId = null, cb = ()=> null) {
		Meteor.call('Request.reply', {requestId, accept: true}, cb);
	},

	deny(requestId = null, cb = ()=> null) {
		Meteor.call('Request.reply', {requestId, accept: false}, cb);
	}
};