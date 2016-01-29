const {Post} = Meteor.TheLeader.models;

EvaluationContent = Astro.Class({
	name: 'EvaluationContent',
	fields: {
		leaderId: {
			type: 'string',
			validator: [
				Validators.required(),
				Validators.string(),
			]
		},
		goal: {
			type: 'number',
			validator: [
				Validators.choice(_.range(0, 6))
			]
		},
		meeting: {
			type: 'number',
			validator: [
				Validators.choice(_.range(0, 6))
			]
		},
		groundRules: {
			type: 'number',
			validator: [
				Validators.choice(_.range(0, 6))
			]
		},
		communication: {
			type: 'number',
			validator: [
				Validators.choice(_.range(0, 6))
			]
		},
		leadership: {
			type: 'number',
			validator: [
				Validators.choice(_.range(0, 6))
			]
		},
		workload: {
			type: 'number',
			validator: [
				Validators.choice(_.range(0, 6))
			],
			default() {
				return null;
			}
		},
		energy: {
			type: 'number',
			validator: [
				Validators.choice(_.range(0, 6))
			]
		},
		stress: {
			type: 'number',
			validator: [
				Validators.choice(_.range(0, 6))
			]
		},
		decision: {
			type: 'number',
			validator: [
				Validators.choice(_.range(0, 6))
			]
		},
		respect: {
			type: 'number',
			validator: [
				Validators.choice(_.range(0, 6))
			]
		},
		conflict: {
			type: 'number',
			validator: [
				Validators.choice(_.range(0, 6))
			]
		},
		overall: 'number',
	}
});

Evaluation = Post.inherit({
	name: 'Evaluation',
	fields: {
		type: {
			type: 'number',
			default() {
				return Post.TYPE.EVALUATION;
			}
		},
		content: {
			type: 'object',
			nested: 'EvaluationContent',
			default() {
				return {
					leaderId: -1,
					goal: -1,
					meeting: -1,
					groundRules: -1,
					communication: -1,
					leadership: -1,
					workload: -1,
					energy: -1,
					stress: -1,
					decision: -1,
					respect: -1,
					conflict: -1,
					overall: -1,
				}
			}
		}
	},

	methods: {
		overall() {
			const content = _.clone(this.content);
			delete content['leaderId'];
			delete content['overall'];
			let total = 0;
			let i = 0;
			_.each(_.toArray(content), (p) => {
				if(p >= 0) {
					total += p;
					i++;
				}
			});
			let o = parseFloat(total / i);
			return parseFloat(o.toFixed(2));
		}
	}
});

Meteor.TheLeader.registerModel('Evaluation', Evaluation);