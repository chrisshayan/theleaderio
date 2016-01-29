const {Evaluation, Relationship} = Meteor.TheLeader.models;
const {Evaluations, Relationships} = Meteor.TheLeader.collections;


/**
 * Submit new evaluation
 *
 * @param body {Object}
 * @param body.leaderId {string, required}
 *
 * @return {LResponse}
 */
Meteor.TheLeader.registerApi({
	name: 'Evaluation.create',
	route: '/post/evaluate',
	method: 'POST',
	action(body, params) {
		const response = new LResponse();
		try {
			this.unblock();
			if (!this.userId) return response.userNotLoggedIn().end();

			const model = new Evaluation({
				content: body,
				createdBy: this.userId,
				createdAt: new Date()
			});

			if (model.content.validate()) {
				const leader = Meteor.users.findOne({_id: model.content.leaderId});
				if (!leader) {
					return response
						.invalidParameter({leaderId: 'Leader not found'}, 'Leader not found')
						.end();
				} else {
					const hasRelationship = Relationships.find({
						userId: leader._id,
						otherId: this.userId,
						type: Relationship.TYPE.LEADER_EMPLOYEE
					}).count();

					if (!hasRelationship) {
						return response
							.permissionDenied({
								leaderId: "You don't have permission to send feedback to this user."
							}, "You don't have permission to send feedback to this user.")
							.end();
					}

					// all data
					model.set('followers', [
						this.userId,
						model.content.leaderId
					]);
					model.set('content.overall', model.overall());
					const postId = model.save();
					if (postId) {
						return response.success({postId}).end();
					} else {
						return response.unknownError().end();
					}
				}
			} else {
				return response
					.invalidParameter(model.content.getValidationErrors())
					.end();
			}
		} catch (e) {
			console.log("Error: Send feedback");
			console.trace(e);
			return response.unknownError().end();
		}

	}
});

