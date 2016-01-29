if (Meteor.isServer) {
	const {Post, Notification} = Meteor.TheLeader.models;
	const {Posts} = Meteor.TheLeader.collections;

	Posts.after.insert(function (userId, post) {
		// push notification to receiver
		Meteor.defer(function () {
			let noty = null,
				type = null,
				userId = null,
				refs = {postId: post._id},
				message = '',
				createdBy = '';


			switch (post.type) {
				case Post.TYPE.FEEDBACK:
					userId = post.content.leaderId;
					type = Notification.TYPE.FEEDBACK_CREATED;
					message = post.content.text;
					createdBy = post.createdBy;

					break;
				case Post.TYPE.EVALUATION:
					userId = post.content.leaderId;
					type = Notification.TYPE.EVALUATION_CREATED;
					message = "Overall is " + post.content.overall;
					createdBy = post.createdBy;
					break;

			}

			if(type) {
				const noty = new Notification({userId, type, refs, message, createdBy});
				noty.save();
			}
		})
	});
}