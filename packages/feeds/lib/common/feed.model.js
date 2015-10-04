Feed = BaseModel.extendAndSetupCollection("feeds");

Feed.appendSchema({
    type: {
        type: Number,
        // 1: Feedback, 2: Survey, 3, Post
    },
    data: {
        type: Object,
        blackbox: true
    },
    followers: {
        type: [String]
    },
    createdAt: {
        type: Date
    },
    createdBy: {
        type: String
    }
});

Feed.prototype.isSelf = function () {
    return this.createdBy === Meteor.userId();
};

Feed.prototype.timeago = function () {
    return moment(this.createdAt).fromNow();
};

Feed.prototype.datetime = function () {
    return moment(this.createdAt).calendar();
};

Feed.prototype.title = function () {
    var t = '';
    if (this.isSelf()) {
        switch (this.type) {
            case 1:
                t = 'sent feedback to';
                break;

            case 2:
                t = 'sent survey to';
                break;
        }
    } else {
        switch (this.type) {
            case 1:
                t = 'received feedback from';
                break;

            case 2:
                t = 'received survey from';
                break;
        }
    }
    return t;
};

Feed.prototype.sender = function () {
    return "You";
};

Feed.prototype.senderId = function() {
    if(!this.isSelf() && this.data.hasOwnProperty('isAnonymous') && this.data.isAnonymous) {
        return '';
    }
    return this.createdBy;
};

Feed.prototype.receiver = function () {
    if(this.isSelf()) {
        var profile = Meteor.profiles.findOne({userId: this.createdBy});
        return profile && [profile.firstName, profile.lastName].join(' ');
    } else {
        switch (this.type) {
            case 1:
                if(this.data.isAnonymous)
                    return 'Anonymous';
                var profile = Meteor.profiles.findOne({userId: this.data.leaderId});
                return profile && [profile.firstName, profile.lastName].join(' ');
                break;
            case 2:
                var profile = Meteor.profiles.findOne({userId: this.data.leaderId});

                break;
        }
    }
    return profile && [profile.firstName, profile.lastName].join(' ');
};

Feed.prototype.content = function () {
    var t = '';
    switch (this.type) {
        case 1:
            t = '<p>' + this.data.content + '</p>';
            break;
        case 2:
            t = '<p>Overall is <strong>' + this.data.overall + '</strong></p>';
            break;
    }
    return t;
};


