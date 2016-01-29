Request.extend({
	events: {
		beforeUpdate(e) {
			this.set('updatedAt', new Date())
		}
	}
})