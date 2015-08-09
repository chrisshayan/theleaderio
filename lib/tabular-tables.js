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
