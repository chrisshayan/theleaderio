Migrations.add({
    version: 3,
    name: 'generate feeds for survey and feedbacks',
    up: function () {

        Collections.Feedbacks.find().forEach(function(f) {
            var cond = {
                type: 1,
                "data.typeId": f._id
            };
            if(!Meteor.feeds.find(cond).count()) {
                var feed = new Feed();
                feed.type = 1;
                feed.data = {
                    typeId: f._id,
                    leaderId: f.leaderId,
                    isAnonymous: f.isAnonymous,
                    content: f.content
                };
                feed.createdAt = f.createdAt;
                feed.createdBy = f.createdBy;
                feed.followers = [f.createdBy, f.leaderId];
                feed.save();
            }
        });

        Collections.Surveys.find().forEach(function(s) {
            var cond = {
                type: 2,
                "data.typeId": s._id
            };
            if(!Meteor.feeds.find(cond).count()) {
                var feed = new Feed();
                feed.type = 2;
                feed.data = {
                    typeId: s._id,
                    leaderId: s.leaderId,
                    overall: s.overall
                };
                feed.createdAt = s.createdAt;
                feed.createdBy = s.createdBy;
                feed.followers = [s.createdBy, s.leaderId];
                feed.save();
            }
        });

    },
    down: function () {

    }
})