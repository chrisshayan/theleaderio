User.prototype.feeds = function (option) {
    var filter = {
        followers: Meteor.userId()
    };

    if (!option) option = {};
    if (!option.limit) option.limit = 10;
    if (!option.sort) option.sort = {createdAt: -1};
    return Meteor.feeds.find(filter, option);
};