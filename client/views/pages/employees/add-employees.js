AddEmployeesCollection = new Mongo.Collection(null);

function addMoreEmployeeForm() {
    var hasLastForm = AddEmployeesCollection.find({order: 10000});
    if (hasLastForm.count() <= 0)
        AddEmployeesCollection.insert({
            firstName: "",
            lastName: "",
            email: "",
            order: 10000
        });
}

function updateEmployee(doc, firstName, lastName, email) {
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    if (firstName.length > 0 || lastName.length > 0 || email.length > 0) {

        AddEmployeesCollection.update({_id: doc._id}, {
            $set: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                order: (doc.order < 10000) ? doc.order : AddEmployeesCollection.find().count() - 1
            }
        });

        addMoreEmployeeForm();
    }
}

Template.addEmployees.onCreated(function () {
    Session.setDefault('isImporting', false);
    AddEmployeesCollection.remove({});
    AddEmployeesCollection.insert({
        firstName: "",
        lastName: "",
        email: "",
        order: 10000
    })
});

Template.addEmployees.helpers({
    items: function () {
        return AddEmployeesCollection.find({}, {sort: {order: 1}});
    },

    isImporting: function () {
        return Session.get('isImporting');
    }
});

Template.addEmployees.events({
    'change .import-employees-btn input': function (e, tmpl) {
        var file = e.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function () {
                Session.set('isImporting', true);
                var lastTotal = AddEmployeesCollection.find().count() - 1;
                Papa.parse(this.result, {
                    header: true,
                    skipEmptyLines: true,
                    step: function (results, parser) {
                        if (results.errors.length == 0) {
                            _.each(results.data, function (item) {
                                var employee = {
                                    firstName: "",
                                    lastName: "",
                                    email: ""
                                };
                                var emailPat = /email/i;
                                var firstNamePat = /first/i;
                                var lastNamePat = /last/i;
                                _.each(item, function (v, k) {
                                    if (emailPat.test(k)) {
                                        employee.email = v;
                                    } else if (firstNamePat.test(k)) {
                                        employee.firstName = v;
                                    } else if (lastNamePat.test(k)) {
                                        employee.lastName = v;
                                    }
                                })
                                if (employee.firstName.length > 0 || employee.lastName.length > 0 || employee.email.length > 0) {
                                    if (employee.email.length > 0) {
                                        var isExists = AddEmployeesCollection.find({email: employee.email}).count() > 0;
                                        if (isExists) return;
                                    }
                                    employee.order = AddEmployeesCollection.find().count() - 1;
                                    AddEmployeesCollection.insert(employee);
                                }
                            });
                        }
                    },
                    complete: function (results, file) {
                        var totalImported = AddEmployeesCollection.find().count() - lastTotal - 1;
                        toastr.success("Imported " + totalImported + " employees");
                        Session.set("isImporting", false);
                    }
                });
            };
            reader.readAsText(file);
        }
    },
    'submit #add-employees-form': function(e) {
        var employees = AddEmployeesCollection.find({order: {$lt: 10000}});
        if(employees.count() > 0) {
            Meteor.call('addEmployees', employees.fetch(), function(err, result) {
                if(err) throw err;
                if(result) {
                    Router.go("employees");
                }
            })
        }
        e.preventDefault();
    }
});


Template.addEmployeeForm.helpers({
    hasRemove: function () {
        return this.order < 10000;
    }
});

Template.addEmployeeForm.events({
    'keyup .first-name,.last-name,.email ': function (e, tmpl) {
        var firstName = tmpl.find('.first-name').value;
        var lastName = tmpl.find('.last-name').value;
        var email = tmpl.find('.email').value;
        updateEmployee(this, firstName, lastName, email);
    },
    'click .remove': function (e, tmpl) {
        AddEmployeesCollection.remove({_id: this._id});

    }
});
