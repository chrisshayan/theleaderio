BlazeComponent.extendComponent({
    onCreated: function () {
        var self = this;
        var props = Template.instance().data;
        this.state = new ReactiveDict();
        self.state.set('text', '');
        self.state.set('url', '');

        this.tracker = this.autorun(function() {
            self.state.set('text', '');
            self.state.set('url', '');

            var profile = Meteor.profiles.findOne({userId: props.userId});
            if(profile) {
                if(profile.picture) {
                    var picture = Meteor.images.findOne({_id: profile.picture});
                    if(picture) {
                        self.state.set('url', picture.url());
                    }
                }
                if(!self.state.get('url')) {
                    self.state.set('text', profile ? profile.firstName[0] : '');
                }
            } else {
                SubsCache.subscribe('avatar', props.userId);
            }
        });

    },

    onDestroyed: function() {
        this.tracker.stop();
    },

    events: function () {
        return [{

        }];
    },

    isPicture: function() {
        return !!this.state.get('url');
    }
}).register('Avatar');