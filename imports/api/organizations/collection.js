import { Mongo } from 'meteor/mongo';

class OrganizationsCollection extends Mongo.Collection {
	insert(doc, callback) {
		// hook event: before insert
		doc.createdAt = doc.updatedAt = new Date();
		if(_.isEmpty(doc.leaderId)) {
			doc.leaderId = Meteor.userId();
		}
		return super.insert(doc, callback);
	}

	update(selector, modifier) {
		// hook event: before update
		if (!modifier['$set']) modifier['$set'] = {};
		modifier['$set'].updatedAt = new Date();
		return super.update(selector, modifier);
	}
}

export default OrganizationsCollection;
