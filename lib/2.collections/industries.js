Schemas.Industry = new SimpleSchema({
    name: {
        type: String
    },
    slug: {
    	type: String
    }
});

function denyAll() {
	return true;
}

Collections.Industries = new Mongo.Collection("industries");
Collections.Industries.friendlySlugs({
    slugFrom: 'name',
    slugField: 'slug',
    distinct: true,
    updateSlug: true
});
