import { Organizations } from '../index';

const PAGE_LIMIT = 9;

Meteor.publish('organizations.list', function({ page = 1, q = '' }) {
	if(!this.userId) return null;
	
	check(q, Match.Optional(String));
	check(page, Match.Optional(Number));

	let selector = {
		owner: this.userId
	};

	let option = {
		limit: (PAGE_LIMIT * page) + 3,
		skip: 0,
		sort: { createdAt: -1 },
		fields: Organizations.publicFields,
	};

	// filter by keyword
	if(!_.isEmpty(q)) {
		selector = {
			$or: [
				{name: { $regex: q, $options: 'i' }},
			]
		};
	}

	return Organizations.find(selector, option);
});

Meteor.publish('organizations.details', function({ _id }) {
	check(_id, String);
	let selector = { _id };
	let option = {
		limit: 1,
		fields: Organizations.publicFields,
	};

	return Organizations.find(selector, option);
})