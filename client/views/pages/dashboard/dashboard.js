Template.dashboard.onCreated(function() {
   //Meteor.call('', function(err, result) {
   //    if(err) throw err;
   //    console.log(result);
   //});
});

Template.dashboard.rendered = function(){
    // Set white background color for top navbar
    $('body').addClass('light-navbar');
};

Template.dashboard.destroyed = function(){

    // Remove extra view class
    $('body').removeClass('light-navbar');
};



