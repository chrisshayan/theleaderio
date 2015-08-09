AutoForm.hooks({
    employeeForm: {
        onSuccess: function() {
            Router.go("employees")
        }
    }
});


Template.employeeActions.events({
    'click .remove': function() {
    	var _id = this._id;
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this employee!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false,
            html: false
        }, function() {
        	Collections.Employees.remove({_id: _id});
            swal("Deleted!", "Your employee has been deleted.", "success");
        });
    }
});
