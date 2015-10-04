BlazeComponent.extendComponent({
    onCreated: function () {
        var self = this;
        this.props = new ReactiveDict();
        this.autorun(function () {
            var user = self.data();
            var profile = user ? user.getProfile() : {};
            // Reset info
            self.props.set('userId', user._id);
            self.props.set('name', '');
            self.props.set('headline', '');
            self.props.set('email', user.defaultEmail());

            if (profile) {
                self.props.set('name', [profile.lastName, profile.firstName].join(' '));
                self.props.set('headline', profile.headline);
            }
        })
    },

    userId: function() {
        return this.props.get('userId');
    },

    name: function() {
        return this.props.get('name');
    },

    headline: function() {
        return this.props.get('headline');
    },

    email: function() {
        return this.props.get('email');
    }

}).register('Employee');