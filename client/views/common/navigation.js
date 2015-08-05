Template.navigation.rendered = function(){

    // Initialize metisMenu
    $('#side-menu').metisMenu();

};

Template.navigation.helpers({
    name: function () {
        return Meteor.user().profile.name;
    }
});