var imageStore = new FS.Store.GridFS("images", {
    maxTries: 1,
    chunkSize: 1024 * 1024
});

Collections.Images = new FS.Collection("images", {
    stores: [imageStore]
});

Collections.Images.allow({
    'insert': function (userId, doc) {
        return !!userId;
    },
    download: function(userId, fileObj) {
        return true;
    }
});