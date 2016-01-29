RequestInvite.extend({
	methods: {
		statusText() {
			switch (this.status) {
				case RequestInvite.STATUS.APPROVED:
					return 'Approved';

				case RequestInvite.STATUS.REVOKED:
					return 'Revoked';

				case RequestInvite.STATUS.CONNECTED:
					return 'Connected';

				default:
					return 'New';
			}
		},

		flat() {
			const data = this.raw();
			data.statusText = this.statusText();
			return data;
		}
	}
});