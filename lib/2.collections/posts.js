Schemas.Post = new SimpleSchema({
    title: {
        type: String
    },
    slug: {
        type: String
    },
    content: {
        type: String
    },
    tags: {
        type: [String],
        optional: true
    },
    picture: {
        type: String,
        optional: true
    },
    createdAt: {
        type: Date
    },
    createdBy: {
        type: String
    }
});

function denyAll() {
    return true;
}

Collections.Posts = new Mongo.Collection("blog");
Collections.Posts.attachSchema(Schemas.Post);
Collections.Posts.friendlySlugs({
    slugFrom: 'name',
    slugField: 'slug',
    distinct: true,
    updateSlug: true
});
