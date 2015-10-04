TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

TabularTables.EmployeeRequests = new Tabular.Table({
    name: "EmployeeRequests",
    collection: Collections.EmployeeRequests,
    selector: function (userId) {
        return {
            status: {
                $in: [1,2]
            },
            createdBy: userId
        }
    },
    columns: [{
        data: "firstName",
        title: "First name",
        width: "15%"
    }, {
        data: "lastName",
        title: "Last name",
        width: "15%"
    },
        {
            data: "email",
            title: "Email",
            width: "30%"
        },
        {
            data: "status",
            title: "Status",
            render: function (val, type, doc) {
                return LEADER_REQUEST_STATUS[val];
            },
            width: "50px"
        },
        {
            tmpl: Meteor.isClient && Template.employeeRequestActions,
            width: "15%"
        }]
});

TabularTables.LeaderRequests = new Tabular.Table({
    name: "LeaderRequests",
    collection: Collections.LeaderRequests,
    selector: function (userId) {
        var user = Meteor.users.findOne({_id: userId});
        var filter = {
            status: {
                $in: [1,2]
            }
        };
        if(user.isAdmin()) {
            filter['createdBy'] = {
                $in: [user._id, null]
            };
        } else {
            filter['createdBy'] = user._id;
        }

        return filter;
    },
    columns: [{
        data: "firstName",
        title: "First name",
        width: "15%"
    }, {
        data: "lastName",
        title: "Last name",
        width: "15%"
    },
        {
            data: "email",
            title: "Email",
            width: "30%"
        },
        {
            data: "headline",
            title: "Headline",
            width: "20%"
        },
        {
            data: "status",
            title: "Status",
            render: function (val, type, doc) {
                return LEADER_REQUEST_STATUS[val];
            },
            width: "50px"
        },
        {
            tmpl: Meteor.isClient && Template.leaderRequestActions,
            width: "15%"
        }]
});

TabularTables.MyFeedbacks = new Tabular.Table({
    name: "MyFeedbacks",
    collection: Collections.Feedbacks,
    selector: function (userId) {
        return {
            leaderId: userId
        }
    },
    columns: [{
        data: "content",
        title: "Content",
        width: "40%"
    }, {
        data: "point",
        title: "Point"
    }, {
        data: "createdAt",
        title: "timeago",
        render: function(val) {
            return moment(val).fromNow();
        }
    }]
});

