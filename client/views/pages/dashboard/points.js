Template.points.onCreated(function () {
    var instance = Template.instance();

    var now = moment(new Date());
    var lastMonth = now.clone();
    lastMonth.subtract(1, 'month');

    instance.currentMonth = function () {
        var filter = {
            leaderId: Meteor.userId(),
            year: now.year(),
            month: now.month() + 1
        };
        return Collections.SurveyStatistics.findOne(filter);
    };
    instance.lastMonth = function () {
        var filter = {
            leaderId: Meteor.userId(),
            year: lastMonth.year(),
            month: lastMonth.month() + 1
        };
        return Collections.SurveyStatistics.findOne(filter);
    };

    Meteor.subscribe('points');
});

Template.points.helpers({
    avgPoint: function (type) {
        var currentMonth = Template.instance().currentMonth();
        if (!currentMonth) return '-';
        var data = currentMonth[type];
        return data ? data.toFixed(1) : 0;
    },

    inc: function (type) {
        var currentMonth = Template.instance().currentMonth();
        var lastMonth = Template.instance().lastMonth();
        if (!currentMonth || !lastMonth) return null;
        var i = ((currentMonth[type] - lastMonth[type]) * 100) / lastMonth[type];
        i = i.toFixed(1);
        if(i > 0) return '+' + i;
        else if(i < 0) return i;
        return null;
    },

    incLabel: function (type) {
        var currentMonth = Template.instance().currentMonth();
        var lastMonth = Template.instance().lastMonth();
        if (!currentMonth || !lastMonth) return null;
        var i = ((currentMonth[type] - lastMonth[type]) * 100) / lastMonth[type];
        if(i > 0) return ' label-success ';
        return ' label-danger ';
    }
});