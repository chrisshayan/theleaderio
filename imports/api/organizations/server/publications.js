import { Organizations } from '../index';

const PAGE_LIMIT = 10;

Meteor.publish('organizations.list', function({ page:number = 1, q:string = '' }) {
	if(!Meteor.userId()) return null;
	
	check(q, String);
	check(page, Number);

	let selector = option = {};

	// query selector
	if(!_.isEmpty(q)) {
		selector = {
			$or: [
				{name: { $regex: q, $options: 'i' }},
			]
		};
	}

	// query option
	option = {
		limit: PAGE_LIMIT,
		skip: PAGE_LIMIT * (page - 1),
	};
	
	return Organizations.find(selector, option);
});