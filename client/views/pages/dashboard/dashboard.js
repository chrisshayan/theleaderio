Template.dashboard.rendered = function(){


    // Set white background color for top navbar
    $('body').addClass('light-navbar');

    //
    //
    //
    //$("span.pie").peity("pie", {
    //    fill: ['#1ab394', '#d7d7d7', '#ffffff']
    //})
};

Template.dashboard.destroyed = function(){

    // Remove extra view class
    $('body').removeClass('light-navbar');
};



