Industry = Astro.createClass({
	name: 'Industry',
	collection: new Mongo.Collection('industries'),
	fields: {
		name: {
			type: 'string'
		},
		order: {
			type: 'number'
		}
	}
});

Meteor.TheLeader.registerModel('Industry', Industry);
Meteor.TheLeader.registerCollection('Industries', Industry.getCollection());
