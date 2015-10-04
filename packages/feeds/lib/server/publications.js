Meteor.publishComposite('feeds', function (option) {
    if (!this.userId) return null;
    var self = this;
    return {
        find: function () {
            var filter = {
                followers: self.userId
            };

            if (!option) option = {};
            // clean limit
            if (!option.limit) option.limit = 11;
            else option.limit += 1;

            // clean sort
            if (!option.sort) option.sort = {createdAt: -1};
            option = _.pick(option, 'limit', 'sort');
            return Meteor.feeds.find(filter, option);
        },

        children: [
            // publish users
            // publish object relate
            {
                find: function (feed) {
                    switch (feed.type) {
                        case 1: // feedback
                            var option = {};
                            if (feed.data.isAnonymous) {
                                option.fields = {
                                    point: 1,
                                    content: 1,
                                    leaderId: 1,
                                    createdAt: 1
                                };
                            }
                            return Collections.Feedbacks.find({_id: feed.data.typeId}, option);
                            break;
                        case 2: // survey
                            return Collections.Surveys.find({_id: feed.data.typeId});
                            break;
                        default:
                            return null;
                    }
                },

                children: [
                    {
                        find: function (d) {
                            if (d.createdBy) {
                                var option = {
                                    limit: 1,
                                    fields: {
                                        firstName: 1,
                                        lastName: 1,
                                        headline: 1,
                                        bio: 1,
                                        picture: 1
                                    }
                                };
                                return Meteor.profiles.find({userId: d.createdBy}, option);
                            } else {
                                return null;
                            }
                        }
                    }
                ]
            }
        ]
    };
});