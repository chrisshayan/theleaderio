Template.feedbackType.onRendered(function() {
	$(".feedback-input").autosize();
});

Template.feedbackType.onCreated(function() {
	var instance = Template.instance();
	instance.props = new ReactiveDict();
	instance.inc = 5;
	instance.props.set("limit", instance.inc);
	var type = this.data.type;
	instance.autorun(function() {
		var token = Router.current().params.token;
		instance.subscribe('feedbacks', token, type, instance.props.get("limit"));
	});
});

Template.feedbackType.events({
	'click .send-feedback': function(e, tmpl) {
		var target = $(tmpl.find(".feedback-input"));
		var type = target.data("feedback");
		var txt = target.val().trim();
		var token = Router.current().params.token;
		if(txt.length <= 0 || !token) return;
		var data = {
			type: type,
			content: txt,
			token: token
		}
		Meteor.call("addFeedback", data, function(err, result) {
			if(err) throw err;
			if(result) {
				target.val("");
				target.height(40);
			}
		});
	},
	'click .load-more': function() {
		var instance = Template.instance();
		var limit = instance.props.get("limit") + instance.inc;
		instance.props.set("limit", limit);
	}
});

Template.feedbackType.helpers({
	items: function() {
		var instance = Template.instance();
		var opt = {
			limit: instance.props.get("limit"),
			sort: {
				createdAt: -1
			}
		}
		return Collections.Feedbacks.find({type: instance.data.type}, opt);
	},
	isLoadmoreAbility: function() {
		var instance = Template.instance();
		var total = Collections.Feedbacks.find({type: instance.data.type}).count();
		return total > instance.props.get("limit");
	},
	allowSendFeedback: function() {
		return !Meteor.userId() && Router.current().params.token;
	}
})

Template.feedbackItem.helpers({
	elementLabel: function() {
		switch(this.type) {
			case "positive":
				return "success";
			case "negative":
				return "warning";
			case "neutral":
				return "info";
		}
	},
	timeago: function() {
		return moment(this.createdAt).fromNow();
	}
})