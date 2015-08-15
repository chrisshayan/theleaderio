
Template.points.onCreated(function() {
    var instance = Template.instance();
    instance.points = new ReactiveDict();
    var methodName = "avgPoints";
    var leaderId = Meteor.userId();
    if(Router.current().params.token) {
        methodName = "avgPointsWithToken";
        leaderId = Router.current().params.token;
    }
    Meteor.call(methodName, leaderId, function(err, data) {
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
    },

    avgOverall: function() {
        var points = 0;
        var instance = Template.instance();
        if(!instance.points.get("goalRating")) return 0;

        _.each(instance.points.keys, function(val, key) {
            points = points + parseFloat(instance.points.get(key));
        }); 
        return (points/_.keys(instance.points.keys).length).toFixed(1); 
    }
});