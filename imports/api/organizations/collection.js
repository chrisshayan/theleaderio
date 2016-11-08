import { Mongo } from 'meteor/mongo';


class OrganizationsCollection extends Mongo.Collection {
	insert(doc, callback) {
		// hook event: before insert
		doc.createdAt = doc.updatedAt = new Date();
		if(_.isEmpty(doc.leaderId)) {
			doc.leaderId = Meteor.userId();
		}
		var result = super.insert(doc, callback);
		if(Meteor.isServer) {
			var intercom = require('/imports/api/intercom');
			// console.log(intercom)
		}
		return result;
	}

	update(selector, modifier) {
		// hook event: before update
		if (!modifier['$set']) modifier['$set'] = {};
		modifier['$set'].updatedAt = new Date();
		return super.update(selector, modifier);
	}
}

export default OrganizationsCollection;
