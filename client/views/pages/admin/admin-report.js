Template.adminReport.onCreated(function () {
    var instance = Template.instance();
    instance.report = new ReactiveVar(null);
    Meteor.call('getAdminReport', function(err, data) {
        if(err) throw err;
        instance.report.set(data);
    });
});

Template.adminReport.helpers({
    report: function(type) {
        var reportType = type.split(".");
        var data = Template.instance().report.get();
        if(!data) return 0;
        if(reportType.length < 2) return data[reportType[0]];
        return data[reportType[0]][reportType[1]];
    },

    industries: function() {
        var data = Template.instance().report.get();
        if(!data) return [];
        return _.sortByOrder(data.industries, ['count', 'desc']);
    }
});