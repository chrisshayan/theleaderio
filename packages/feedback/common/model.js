const {Post} = Meteor.TheLeader.models;

FeedbackContent = Astro.Class({
	name: 'FeedbackContent',
	fields: {
		leaderId: {
			type: 'string',
			validator: [
				Validators.required(),
				Validators.string(),
			]
		},
		text: {
			type: 'string',
			validator: [
				Validators.required(),
				Validators.string(),
			]
		},
		point: {
			type: 'number',
			validator: [
				Validators.choice(_.range(-5, 6))
			],
			default() {
				return 0;
			}
		},
		isAnonymous: {
			type: 'boolean',
			validator: [
				Validators.choice([true, false])
			],
			default() {
				return false;
			}
		},
	}
});

Feedback = Post.inherit({
	name: 'Feedback',
	fields: {
		type: {
			type: 'number',
			default() {
				return Post.TYPE.FEEDBACK;
			}
		},
		content: {
			type: 'object',
			nested: 'FeedbackContent',
			default() {
				return {
					leaderId: '',
					text: '',
					point: 0,
					isAnonymous: false
				}
			}
		}
	}
});

Meteor.TheLeader.registerModel('Feedback', Feedback);
Meteor.TheLeader.registerCollection('Feedbacks', Feedback.getCollection());