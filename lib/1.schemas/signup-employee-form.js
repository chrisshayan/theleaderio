SimpleSchema.messages({
	passwordMissmatch: "Passwords don't match"
})

Schemas.signupEmployeeForm = new SimpleSchema({
    firstName: {
        type: String,
        autoform: {
            label: false,
            placeholder: "First name",
            value: function() {
                var data = Session.get("employeeInvitationData");
                return data && data.firstName ? data.firstName : "";
            }
        }
    },
    lastName: {
        type: String,
        optional: true,
        autoform: {
            label: false,
            placeholder: "Last name",
            value: function() {
                var data = Session.get("employeeInvitationData");
                return data && data.lastName ? data.lastName : "";
            },
        }
    },
    email: {
        type: String,
        optional: true,
        autoform: {
            label: false,
            placeholder: "Email",
            disabled: true,
            value: function() {
                var data = Session.get("employeeInvitationData");
                return data && data.email ? data.email : "";
            },
        }
    },
    password: {
        type: String,
        min: 6,
        autoform: {
            type: "password",
            label: false,
            placeholder: "Password"
        }
    },
    repassword: {
        type: String,
        custom: function() {
            if (this.value !== this.field('password').value) {
                return "passwordMissmatch";
            }
        },
        autoform: {
            type: "password",
            label: false,
            placeholder: "Password Confirmation",
        }
    }
});
