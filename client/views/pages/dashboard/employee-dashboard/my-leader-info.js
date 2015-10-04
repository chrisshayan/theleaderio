Template.MyLeaderInfo.onCreated(function () {
    var instance = Template.instance();
    instance.props = new ReactiveDict();
    instance.props.set('isLoading', true);
    Meteor.call('getMyLeaderInfo', function (err, leader) {
        instance.props.set('isLoading', false);
        if (err) throw err;
        if (leader) {
            _.each(leader, function (v, k) {
                instance.props.set(k, v);
            });
        }
    });
});

Template.MyLeaderInfo.helpers({
    isLoading: function() {
        Template.instance().props.get('isLoading');
    },

    name: function () {
        var props = Template.instance().props;
        return [props.get('firstName'), props.get('lastName')].join(' ');
    },

    email: function() {
        var props = Template.instance().props;
        return props.get('email');
    },

    headline: function() {
        var props = Template.instance().props;
        return props.get('headline');
    },

    bio: function() {
        var props = Template.instance().props;
        return props.get('bio');
    },

    leaderId: function() {
        var props = Template.instance().props;
        return props.get('userId');
    },

    size: function() {
        return 'large';
    },

    employees: function() {
        var props = Template.instance().props;
        return props.get('employees');
    },

    feedbacks: function() {
        var props = Template.instance().props;
        return props.get('feedbacks');
    }
});

