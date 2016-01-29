Relationship = Astro.Class({
	name: 'Relationship',
	collection: new Mongo.Collection('relationships'),
	fields: {
		'type': {
			type: 'number',
			default () {
				/**
				 * 0: leader - employee
				 * 1: friend
				 */
				return 0;
			}
		},
		'userId': {
			type: 'string',
			default () {
				return '';
			}
		},
		'otherId': {
			type: 'string',
			default () {
				return '';
			}
		},
		'extra': {
			type: 'object',
			default () {
				return {};
			}
		}
	}
});


Meteor.TheLeader.registerModel('Relationship', Relationship);
Meteor.TheLeader.registerCollection('Relationships', Relationship.getCollection());