TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

TabularTables.Employees = new Tabular.Table({
    name: "Employees",
    collection: Collections.Employees,
    selector: function(userId) {
        return {
            createdBy: userId
        }
    },
    columns: [{
        data: "name",
        title: "Name"
    }, {
        data: "email",
        title: "Email"
    },
    {
      tmpl: Meteor.isClient && Template.employeeActions
    }]
});

TabularTables.LeaderRequests = new Tabular.Table({
    name: "LeaderRequests",
    collection: Collections.LeaderRequests,
    selector: function(userId) {
        return {
            
        }
    },
    columns: [{
        data: "firstName",
        title: "First name",
        width: "20%"
    },{
        data: "lastName",
        title: "Last name",
        width: "20%"
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
        width: "10"
    },
    {
      tmpl: Meteor.isClient && Template.leaderRequestActions,
      width: "20%"
    }]
});
