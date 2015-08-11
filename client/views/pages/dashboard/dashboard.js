Template.dashboard.rendered = function(){


    // Set white background color for top navbar
    $('body').addClass('light-navbar');

    var d1 = [[1262304000000, 6], [1264982400000, 3057], [1267401600000, 20434], [1270080000000, 31982], [1272672000000, 26602], [1275350400000, 27826], [1277942400000, 24302], [1280620800000, 24237], [1283299200000, 21004], [1285891200000, 12144], [1288569600000, 10577], [1291161600000, 10295]];
    var d2 = [[1262304000000, 5], [1264982400000, 200], [1267401600000, 1605], [1270080000000, 6129], [1272672000000, 11643], [1275350400000, 19055], [1277942400000, 30062], [1280620800000, 39197], [1283299200000, 37000], [1285891200000, 27000], [1288569600000, 21000], [1291161600000, 17000]];

    var data1 = [
        { label: "Data 1", data: d1, color: '#17a084'},
        { label: "Data 2", data: d2, color: '#127e68' }
    ];


    var lineData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "Industry Average",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [3.4, 2.5, 3.5, 4.2, 4.6, 4.3, 4]
            },
            {
                label: "You",
                fillColor: "rgba(26,179,148,0.5)",
                strokeColor: "rgba(26,179,148,0.7)",
                pointColor: "rgba(26,179,148,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(26,179,148,1)",
                data: [4.8, 1.2, 2.5, 3.3, 3.8, 3.3, 2.9]
            }
        ]
    };

    var lineOptions = {
        scaleShowGridLines: true,
        scaleGridLineColor: "rgba(0,0,0,.05)",
        scaleGridLineWidth: 1,
        bezierCurve: true,
        bezierCurveTension: 0.4,
        pointDot: true,
        pointDotRadius: 4,
        pointDotStrokeWidth: 1,
        pointHitDetectionRadius: 20,
        datasetStroke: true,
        datasetStrokeWidth: 2,
        datasetFill: true,
        responsive: true
    };


    var ctx = document.getElementById("lineChart").getContext("2d");
    new Chart(ctx).Line(lineData, lineOptions);


    $("span.pie").peity("pie", {
        fill: ['#1ab394', '#d7d7d7', '#ffffff']
    })
};

Template.dashboard.destroyed = function(){

    // Remove extra view class
    $('body').removeClass('light-navbar');
};




Template.points.onCreated(function() {
    var instance = Template.instance();
    instance.points = new ReactiveDict();
    Meteor.call('avgPoints', Meteor.userId(), function(err, data) {
        if(err) throw err;
        if(data) {
            _.each(data, function(val, key) {
                if(key == "_id") return;
                instance.points.set(key, val);
            })
            
        }
    })
});

Template.points.helpers({
    avgPoint: function(type) {
        var instance = Template.instance();
        
        var data = instance.points.get(type);
        return data ? data.toFixed(1) : 0;
    }
});