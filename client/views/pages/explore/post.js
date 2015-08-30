Template.Post.helpers({
    postPicture: function() {
        var pic = Collections.Images.findOne({_id: this.post.picture});
        return pic.url();
    }
});