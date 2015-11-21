Profile = BaseModel.extendAndSetupCollection("profiles");

Profile.appendSchema({
    userId: {
        type: String,
        unique: true
    },
    firstName: {
        type: String
    },

    lastName: {
        type: String,
        optional: true
    },

    headline: {
        type: String,
        optional: true
    },

    bio: {
        type: String,
        optional: true,
        autoform: {
            type: 'textarea'
        }
    },

    picture: {
        type: String,
        autoform: {
            afFieldInput: {
                type: 'cloudinary'
            }
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
            options: function () {
                return Collections.Industries.find().map(function (r) {
                    return {
                        label: r.name,
                        value: r._id
                    }
                });
            }
        }
    },

    enableLeader: {
        type: Boolean,
        defaultValue: false
    }
});

Meteor.profiles.allow({
    insert: function (userId, doc) {
        return doc && doc.userId && Meteor.profiles.find({userId: doc.userId}).count() == 0;
    },

    update: function (userId, doc, fieldNames, modifier) {
        var result = doc.userId == userId;
        if (fieldNames.indexOf('enableLeader') >= 0) {
            var user = Meteor.users.findOne({_id: userId});
            result &= user.isAdmin();
        }
        return result;
    }


});


Profile.prototype.getPicture = function () {
    return this.picture ? Meteor.images.findOne({_id: this.picture}) : null;
}