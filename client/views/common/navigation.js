Template.navigation.rendered = function(){

    // Initialize metisMenu
    $('#side-menu').metisMenu();

};

Template.navigation.helpers({
    name: function () {
    	if(Meteor.userId() && Meteor.user())
        	return Meteor.user().profile.name;
        if(Session.get("currentEmployee"))
        	return Session.get("currentEmployee").name;
        return false;
    }
});