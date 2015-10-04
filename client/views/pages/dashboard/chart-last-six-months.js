Template.chartLastSixMonths.onCreated(function () {
    var self = this;
    var instance = Template.instance();
    instance.leaderId = Meteor.userId();
    if (instance.data && instance.data.hasOwnProperty('userId')) {
        instance.leaderId = instance.data.userId;
    }

    instance.months = [];
    var today = moment(new Date());
    _.each([5, 4, 3, 2, 1, 0], function (i) {
        var m = today.clone();
        m.subtract(i, 'month');
        instance.months.push({
            year: m.year(),
            month: m.month() + 1
        });
    });
    instance.filter = function () {
        return {
            leaderId: instance.leaderId,
            $or: instance.months
        }
    };

    instance.option = function () {
        return {
            sort: {
                year: 1,
                month: 1
            }
        }
    };

    instance.autorun(function () {
        instance.sub = self.subscribe('reports', instance.filter(), instance.option());
    });
});

Template.chartLastSixMonths.onRendered(function () {
    var instance = Template.instance();
    instance.autorun(function () {
        if (instance.sub.ready()) {
            var labels = [];
            var you = [];
            _.each(instance.months, function (d) {
                var month = moment(new Date(d.year, d.month - 1, 1)).format("MMM");
                var r = Collections.SurveyStatistics.findOne({
                    leaderId: instance.leaderId,
                    year: d.year,
                    month: d.month
                });
                labels.push(month);
                you.push(r ? r.overall : 0);
            });

            var lineData = {
                labels: labels,
                datasets: [
                    {
                        label: "Industry Average",
                        fillColor: "rgba(220,220,220,0.5)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: [3.4, 2.5, 3.5, 4.2, 4.6, 4.3]
                    },
                    {
                        label: "You",
                        fillColor: "rgba(26,179,148,0.5)",
                        strokeColor: "rgba(26,179,148,0.7)",
                        pointColor: "rgba(26,179,148,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(26,179,148,1)",
                        data: you
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

            var ctx = document.getElementById("lastSixMonths").getContext("2d");
            new Chart(ctx).Line(lineData, lineOptions);
        }
    });
});