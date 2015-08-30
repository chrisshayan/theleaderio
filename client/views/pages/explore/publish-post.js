Template.PublishPost.onCreated(function () {
    var instance = Template.instance();
    instance.postPicture = new ReactiveVar(null);
    instance.postTitleErrors = new ReactiveVar(null);
    instance.postContentErrors = new ReactiveVar(null);
});

Template.PublishPost.onRendered(function () {
    tinymce.init({
        menubar: false,
        statusbar: false,
        selector: '.post-content textarea',
        plugins: "table link media image autoresize",
        toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | media"
    });

    $("#post-tags-input").tagsinput();
    $(".bootstrap-tagsinput input").css({
        width: "90%"
    });
});

Template.PublishPost.helpers({
    postPicture: function () {
        return Template.instance().postPicture.get();
    },

    postTitleErrors: function() {
        return Template.instance().postTitleErrors.get();
    },
    postContentErrors: function() {
        return Template.instance().postContentErrors.get();
    }
});

Template.PublishPost.events({
    'change #post-picture': function (event, tmpl) {
        var input = event.target;
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                tmpl.postPicture.set(e.target.result);
            };

            reader.readAsDataURL(input.files[0]);
        }
    },
    'click .publish': function (e, tmpl) {
        var result = false;
        var postTitle = $(tmpl.find(".post-title")).text().trim();
        var postContent = tinymce.activeEditor.getContent();
        var postTags = $('#post-tags-input').tagsinput("items");
        var postPicture = Template.instance().postPicture.get();

        if(postTitle.length < 20) {
            tmpl.postTitleErrors.set("Post title must be at least 20 characters");
        } else {
            tmpl.postTitleErrors.set(null);
            result = true;
        }

        if(_.words($(postContent).text()).length < 50) {
            tmpl.postContentErrors.set("Post content must be at least 50 characters");
        } else {
            result = true;
            tmpl.postContentErrors.set(null);
        }

        if(result) {
            var data = {
                title: postTitle,
                content: postContent,
                tags: postTags || [],
                picture: postPicture || ""
            };
            Meteor.call("publishPost", data, function(err, result) {
                if(err) throw err;
                if(result) {
                    Router.go("post", {_id: result._id});
                }
            })
        }
        e.preventDefault();
    }
})