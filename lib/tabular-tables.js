TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

TabularTables.EmployeeRequests = new Tabular.Table({
    name: "EmployeeRequests",
    collection: Collections.EmployeeRequests,
    selector: function(userId) {
        return {
            createdBy: userId
        }
    },
    columns: [{
        data: "firstName",
        title: "First name",
        width: "15%"
    },{
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
    selector: function(userId) {
        return {
            
        }
    },
    columns: [{
        data: "firstName",
        title: "First name",
        width: "15%"
    },{
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
