Schemas.LeaderRequests = new SimpleSchema({
    firstName: {
        type: String,
        autoform: {
            label: false,
            placeholder: "First name (required)"
        }
    },
    lastName: {
        type: String,
        optional: true,
        autoform: {
            label: false,
            placeholder: "Last name"
        }
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        custom: function() {
            return false;
        },
        autoform: {
            label: false,
            placeholder: "Email (required)"
        }
    },
    headline: {
        type: String,
        optional: true,
        autoform: {
            label: false,
            placeholder: "Headline. ex: Chief Executive Officer"
        }
    },
    status: {
        type: Number,
        defaultValue: 1, // 1: new , 2: invited, 3: connected,
        autoform: {
            omit: true
        }
    },
    createdAt: {
        type: Date,
        autoform: {
            omit: true
        }
    },
    createdBy: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true,
        autoform: {
            omit: true
        }
    }
});

Collections.LeaderRequests = new Mongo.Collection("leader_requests");
Collections.LeaderRequests.attachSchema(Schemas.LeaderRequests);

var checkPermission = function (userId, doc) {
    return Roles.userIsInRole(userId, [ROLE.ADMIN]);
};

Collections.LeaderRequests.allow({
    insert: function (userId, doc) {
        if (userId)
            return Roles.userIsInRole(userId, [ROLE.ADMIN, ROLE.LEADER]);
        return true;
    },
    update: checkPermission,
    remove: checkPermission
});

Collections.LeaderRequests.before.insert(function (userId, doc) {
    doc.createdAt = new Date();
    if (userId)
        doc.createdBy = userId;
});

if (Meteor.isServer) {
    Collections.LeaderRequests.after.insert(function (userId, invitee) {
        if(!userId) return;
        var token = IZToken.generate(invitee, 365 * 24 * 60 * 60);
        if (!token) return;
        var inviter = Meteor.users.findOne({_id: userId});
        var profile = inviter.getProfile();
        var leaderName = profile.firstName + " " + profile.lastName;
        var inviteeName = invitee.firstName;
        var link = Meteor.absoluteUrl("signup-leader/" + token);
        var params = {leaderName: leaderName, invitee: inviteeName, confirmationUrl: link};
        var html = Utils.compileServerTemplate("leadershipInvitationEmail", 'mailtemplates/leadership-invitation-email.html', params)
        var mail = {
            from: inviter.defaultEmail(),
            to: invitee.email,
            subject: leaderName + " has invited you to use theLeader.io",
            html: html
        };
        new JobQueue(Meteor.JC, 'sendEmail', {
            type: 'leaderInvitation',
            requestId: invitee._id,
            mail: mail
        }).save();
        return true;
    });
}


