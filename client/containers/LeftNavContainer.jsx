LeftNavContainer = React.createClass({
	mixins: [ReactMeteorData],
	getInitialState() {
		return {
			menuItems: [
				{
					label: 'Home',
					route: 'App.home',
					icon: 'mdi-action-settings-input-svideo',
				},
				{
					label: 'Feedback',
					route: 'App.feedback',
					icon: 'mdi-action-wallet-giftcard',
				},
				{
					label: 'Employees',
					route: 'App.employees',
					icon: 'mdi-social-people-outline',
				},
				{
					label: 'Measure',
					route: 'App.measure',
					icon: 'mdi-social-school',
				},
				{
					label: 'Profile',
					route: 'App.myProfile',
					icon: 'mdi-action-account-circle',
				}
			],
			adminMenuItems: [
				{
					label: 'Admin',
					route: 'App.admin',
					icon: 'mdi-social-poll',
				}
			]
		}
	},
	getMeteorData() {
		const currentUser = Meteor.user();
		return {
			currentRouteName: FlowRouter.getRouteName(),
			currentUser: currentUser,
			profile: currentUser && currentUser.profile ? currentUser.profile : {}
		}
	},

	getMenuItems() {
		const {currentUser, currentRouteName} = this.data;
		const items = [];
		let _menuItems = this.state.menuItems;

		/**
		 * merge with admin menus
		 */
		if(currentUser && currentUser.isAdmin()) {
			_menuItems = _menuItems.concat(this.state.adminMenuItems);
		}

		/**
		 * extend item data
		 */
		_.each(_menuItems, (item) => {
			item.className = classNames({active: item.route === currentRouteName});
			item.iconClass = classNames('icon', item.icon, 'i-20');
			item.link = FlowRouter.url(item.route);
			items.push(item);
		});

		return items;
	},

	render() {
		return (
			<LeftNav
				menuItems={this.getMenuItems()}
				profile={this.data.profile}
				currentUser={this.data.currentUser}
			/>
		);
	}

});