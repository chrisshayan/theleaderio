SimpleSchema.messages({
	passwordMissmatch: "Passwords don't match"
})

Schemas.signupLeaderForm = new SimpleSchema({
    firstName: {
        type: String,
        autoform: {
            label: false,
            placeholder: "First name",
            value: function() {
                var data = Session.get("leaderInvitationData");
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
                var data = Session.get("leaderInvitationData");
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
                var data = Session.get("leaderInvitationData");
                return data && data.email ? data.email : "";
            },
        }
    },
    headline: {
        type: String,
        optional: true,
        autoform: {
            label: false,
            placeholder: "Headline. ex: Chief Executive Officer",
            value: function() {
                var data = Session.get("leaderInvitationData");
                return data && data.headline ? data.headline : "";
            },
        }
    },
    industries: {
        type: [String],
        optional: true,
        autoform: {
            type: "select2",
            label: false,
            placeholder: "Industries",
            multiple: true,
            options: function() {
                return Collections.Industries.find().map(function(r) {
                    return {
                        label: r.name,
                        value: r._id
                    }
                });
            }
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
