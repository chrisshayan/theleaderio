BlazeComponent.extendComponent({
    onCreated: function () {
        var self = this;
        this.props = new ReactiveDict({});
        this.props.set('isLoading', false);
        this.props.set('inc', 10);
        this.props.set('limit', 10);
        this.props.set('isHasMore', false);

        var userId = Meteor.userId();

        this.autorun(function () {
            self.props.set('isLoading', true);
            var sub = FeedCache.subscribe('feeds', self.option());
            if (sub.ready()) {
                self.props.set('isLoading', false);
                var filter = {
                    followers: userId
                };
                if (Meteor.feeds.find(filter).count() > self.props.get('limit')) {
                    self.props.set('isHasMore', true);
                } else {
                    self.props.set('isHasMore', false);
                }
            }
        });
    },

    option: function () {
        return {
            limit: this.props.get('limit'),
            sort: {
                createdAt: -1
            }
        }
    },
    /**
     * BINDING EVENTS
     */
    events: function () {
        return [{
            'click .load-more': this.loadMore
        }];
    },

    loadMore: function (e) {
        e.preventDefault();
        var inc = this.props.get('inc');
        var limit = this.props.get('limit');
        this.props.set('limit', limit + inc);
    },

    isLoading: function() {
        return this.props.get('isLoading');
    },

    feeds: function () {
        var user = Meteor.user();
        return user ? user.feeds(this.option()) : [];
    },

    isHasMore: function () {
        return this.props.get('isHasMore');
    }

}).register('Feeds');

BlazeComponent.extendComponent({
    onCreated: function () {

    },

    /**
     * BINDING EVENTS
     */
    events: function () {
        return [{

        }];
    }
}).register('FeedItem');