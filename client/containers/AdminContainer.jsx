AdminContainer = React.createClass({
	mixins: [ReactMeteorData],
	getInitialState() {
		return {
			menuItems: [
				{
					label: 'Requests',
					action: 'requests',
				},
				{
					label: 'Users',
					action: 'users'
				},
				{
					label: 'Statistics',
					action: 'statistics'
				}
			],
			size: {
				width: 0,
				height: 0
			}
		};
	},
	getMeteorData() {
		let action = 'requests';
		if (FlowRouter.getQueryParam('action')) {
			action = FlowRouter.getQueryParam('action');
		}
		return {
			action: action,
			currentUser: Meteor.user()
		};
	},

	componentDidMount() {
		const self = this;
		this.onResizeViewport();
		$(window).resize(_.debounce(self.onResizeViewport, 300))
	},

	onResizeViewport() {
		const $container = $(this.refs.container);
		const size = {
			width: $container.width(),
			height: $container.height()
		};
		this.setState({size});
	},

	onSelectTab(action) {
		FlowRouter.setQueryParams({
			action: action
		});
	},
	render() {
		let tabContent = null;
		switch (this.data.action) {
			case 'requests':
				tabContent = <AdminRequestsContainer size={this.state.size} {...this.data} />;
				break;
			case 'users':
				tabContent = <AdminUsersContainer size={this.state.size} {...this.data} />;
				break;

			case 'statistics':
				tabContent = <AdminStatistics/>;
				break;
		}
		return (
			<div className="md-whiteframe-z0 bg-white" ref="container">
				<AdminNav
					menuItems={this.state.menuItems}
					onSelect={this.onSelectTab}
					currentAction={this.data.action}
					/>

				<div className="tab-content p m-b-md b-t b-t-2x">
					{tabContent}
				</div>
			</div>
		);
	}
});
