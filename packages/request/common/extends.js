Request.extend({
	methods: {
		requester() {
			const u = Meteor.users.findOne({_id: this.userId});
			return {
				userId: this.userId,
				name: u ? u.fullname() : ''
			}
		},

		subject() {
			switch (this.type) {
				case Request.TYPE.INVITE_EMPLOYEE_BY_ID:
					return 'invite you to become your leader';
					break;
				default:
					return '';
			}
		}
	}
});