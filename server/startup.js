Meteor.startup(function() {
	// initial data
	setupFixtures();
    if(Meteor.settings.migration) {
        // unlock
        Migrations._collection.update({_id: "control"}, {$set: {"locked": false}});
        Migrations.migrateTo(Meteor.settings.migration);
    }
});