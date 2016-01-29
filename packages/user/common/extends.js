const {Industries} = Meteor.TheLeader.collections;

User.extend({
	methods: {
		// return first email
		defaultEmail() {
			return this.emails[0] ? this.emails[0].address : '';
		},

		fullname() {
			return [this.profile.firstname, this.profile.lastname].join(' ');
		},

		headline() {
			return this.profile.headline;
		},

		picture() {
			return this.profile.picture || '/images/avatar.jpg';
		},

		industries() {
			if(_.isEmpty(this.profile.industries)) return [];
			const selector = {
				_id: {
					$in: this.profile.industries
				}
			};
			const options = {
				fields: {
					_id: 1,
					name: 1
				},
				transform: null
			};
			return Industries.find(selector, options).fetch();
		},

		status() {
			return '';
		},

		isAdmin() {
			return Roles.userIsInRole(this, User.ROLE.ADMIN);
		},

		userInfo() {
			return {
				userId: this._id,
				fullname: this.fullname(),
				avatar: this.profile.avatar,
				headline: this.profile.headline
			};
		},

		firstLetter() {
			const firstName = this.profile.firstname;
			return firstName.length > 0 ? firstName[0] : '';
		},

		refData() {
			return {
				userId: this._id,
				name: this.fullname(),
				headline: this.headline(),
				picture: this.picture()
			}
		},

		myProfile() {
			return {
				userId: this._id,
				firstname: this.profile.firstname,
				lastname: this.profile.lastname,
				picture: this.picture(),
				headline: this.headline(),
				bio: this.profile.bio,
				industries: this.industries()
			}
		},

		flat() {
			return {
				userId: this._id,
				email: this.defaultEmail(),
				firstname: this.profile.firstname,
				lastname: this.profile.lastname,
				picture: this.picture(),
				headline: this.headline(),
				status: this.status()
			}
		}
	}
});