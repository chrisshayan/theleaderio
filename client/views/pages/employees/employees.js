BlazeComponent.extendComponent({
    onCreated: function () {
        var self = this;
        this.props = new ReactiveDict({});
        this.props.set('isReady', false);
        this.props.set('inc', 10);
        this.props.set('limit', 10);
        this.props.set('isHasMore', false);

        var userId = Meteor.userId();

        this.autorun(function () {
            var sub = self.subscribe('employees', self.option());
            if (sub.ready()) {
                self.props.set('isReady', true);
                var filter = {
                    type: 1,
                    userId: userId
                };
                if (Meteor.relationships.find(filter).count() > self.props.get('limit')) {
                    self.props.set('isHasMore', true);
                } else {
                    self.props.set('isHasMore', false);
                }
            }
        });
    },

    option: function () {
        return {
            limit: this.props.get('limit')
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

    employees: function () {
        var leader = Meteor.user();
        return leader ? leader.employees(this.option()) : [];
    },

    isHasMore: function () {
        return this.props.get('isHasMore');
    }

}).register('Employees');