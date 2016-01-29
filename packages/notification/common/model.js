NotificationCollection = new Mongo.Collection('notifications');

Notification = Astro.Class({
	name: 'Notification',
	collection: NotificationCollection,
	fields: {
		userId: {
			type: 'string',
			default() {
				return '';
			}
		},

		type: {
			type: 'number',
			default() {
				return 0;
			}
		},

		refs: {
			type: 'object',
			default () {
				return {};
			}
		},

		message: {
			type: 'string',
			default() {
				return '';
			}
		},

		seen: {
			type: 'boolean',
			default() {
				return false;
			}
		},

		createdAt: {
			type: 'date',
			default () {
				return new Date();
			}
		},

		createdBy: {
			type: 'string',
			default () {
				return null;
			}
		}


	},

	methods: {
		timeago() {
			return new moment(this.createdAt).fromNow();
		}
	}
});

Meteor.TheLeader.registerModel('Notification', Notification);
Meteor.TheLeader.registerCollection('Notifications', Notification.getCollection());
