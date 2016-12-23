import {Meteor} from 'meteor/meteor';
import { Organizations } from '../index';
import { Employees } from '/imports/api/employees';
import {Roles} from 'meteor/alanning:roles';

const PAGE_LIMIT = 9;

Meteor.publish('organizations.list', function({ page = 1, q = '' }) {
	if(!this.userId) return null;
	
	check(q, Match.Optional(String));
	check(page, Match.Optional(Number));

	let selector = {
		leaderId: this.userId
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

Meteor.publish('organizations', function() {
	if(!this.userId) {
		return this.ready();
	}

	return Organizations.find({leaderId: this.userId});
});

Meteor.publishComposite('organizations.details', function({ _id }) {
	check(_id, String);
	return {
		find() {
			let selector = { _id };
			let option = {
				limit: 1,
				fields: Organizations.publicFields,
			};

			return Organizations.find(selector, option);
		},
		children: [
			{
				find(org) {
					if(!org.employees) return null;
					return Employees.find({_id: { $in: org.employees }})
				}
			}
		]
	};
});

Meteor.publish("statistic.organizations", function() {
	if(!this.userId) {
		return this.ready();
	}
	if(!Roles.userIsInRole(this.userId, "admin")) {
		throw new Meteor.Error(ERROR_CODE.PERMISSION_DENIED);
	}

	return Organizations.find();
});