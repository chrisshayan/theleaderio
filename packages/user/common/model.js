Profile = Astro.Class({
	name: 'Profile',
	fields: {
		firstname: {
			type: 'string',
			default() {
				return '';
			}
		},
		lastname: {
			type: 'string',
			default() {
				return '';
			}
		},
		picture: {
			type: 'string',
			default() {
				return '';
			}
		},
		headline: {
			type: 'string',
			default() {
				return '';
			}
		},
		bio: {
			type: 'string',
			default() {
				return '';
			}
		},
		industries: {
			type: 'array',
			default() {
				return [];
			}
		},
	}
});

User = Astro.Class({
	name: 'User',
	collection: Meteor.users,
	fields: {
		'_id': 'string',
		'username': 'string',
		'emails': 'object',
		'services': 'object',
		'profile': {
			type: 'object',
			nested: 'Profile',
			default: function () {
				return {
					firstname: '',
					lastname: '',
					picture: '',
					headline: '',
					bio: '',
					industries: []
				};
			}
		},
		'roles': {
			type: 'array',
			default() {
				return [User.ROLE.USER];
			}
		},
		'createdAt': 'date'
	}
});

Meteor.users._transform = function (document) {
	return new User(document);
};

Meteor.TheLeader.registerModel('User', User);
Meteor.TheLeader.registerCollection('Users', Meteor.users);
