PostCollection = new Mongo.Collection('posts');
Post = Astro.createClass({
	name: 'Post',
	collection: PostCollection,
	fields: {
		type: {
			type: 'number',
			default() {
				return 0;
			}
		},

		refs: {
			type: 'object',
			default() {
				return {};
			}
		},

		content: {
			type: 'object',
			default() {
				return {};
			}
		},

		followers: {
			type: 'array',
			nested: 'string',
			default() {
				return [];
			}
		},

		createdAt: {
			type: 'date',
			default() {
				return new Date();
			}
		},

		createdBy: {
			type: 'string',
			default() {
				return '';
			}
		},

		updatedAt: {
			type: 'date',
			default() {
				return new Date();
			}
		},

		/**
		 * for soft remove
		 */
		deleted: {
			type: 'boolean',
			default() {
				return false;
			}
		}
	}
});

Meteor.TheLeader.registerModel('Post', Post);
Meteor.TheLeader.registerCollection('Posts', Post.getCollection());
