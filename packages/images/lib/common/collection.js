var imageStore = new FS.Store.GridFS("images", {
    maxTries: 1,
    chunkSize: 1024 * 1024
});

Meteor.images = new FS.Collection("images", {
    stores: [imageStore]
});

Meteor.images.allow({
    insert: function (userId, doc) {
        console.log(userId);
        return !!userId;
    },
    update: function() {
        return true;
    },
    download: function(userId, fileObj) {
        return true;
    },
    fetch: null
});