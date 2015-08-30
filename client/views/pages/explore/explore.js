Template.PostItem.helpers({
    postPicture: function() {
        var pic = Collections.Images.findOne({_id: this.picture});
        return pic? pic.url() : "";
    },

    shortContent: function() {
        var content = $(this.content).text();
        return _.words(content).splice(0, 50).join(" ");
    }
});