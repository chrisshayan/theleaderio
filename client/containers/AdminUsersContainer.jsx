AdminUsersContainer = React.createClass({
	mixins: [ReactMeteorData],
	getInitialState() {
		return {
			skip: 0,
			limit: 10
		}
	},
	getMeteorData() {
		const cond = [this.selector(), this.options()];
		const sub = Meteor.subscribe('User.all', ...cond, 'userCount');
		const cursor = Meteor.users.find(...cond);
		return {
			isLoading: !sub.ready(),
			users: cursor.fetch(),
			total: Counts.get('userCount')
		};
	},
	selector() {
		return {
			_id: {
				$ne: this.props.currentUser._id
			}
		};
	},
	options() {
		return {
			limit: this.state.limit,
			skip: this.state.skip
		}
	},
	dataSource() {
		return this.data.users.map((u)=> {
			return u.flat()
		});
	},
	columns() {
		return [
			{
				field: 'picture',
				label: '',
				type: 'image',
				width: 50,
				height: 50,
				image: {
					width: 32,
					height: 32
				}
			},
			{
				field: 'firstname',
				label: 'First name',
				type: 'text',
				width: 120,
				resizable: true
			},
			{
				field: 'lastname',
				label: 'Last name',
				type: 'text',
				width: 120,
				resizable: true
			},
			{
				field: 'email',
				label: 'Email',
				type: 'text',
				width: 200,
				resizable: true
			},
			{
				field: 'headline',
				label: 'Headline',
				type: 'text',
				width: 200,
				resizable: true
			}
		];
	},
	render() {
		return (
			<AdminUsersManagement
				isLoading={this.data.isLoading}
				total={this.data.total}
			    hasMore={this.data.total > this.state.limit}
				dataSource={this.dataSource()}
			    columns={this.columns()}
				{...this.props}
			/>
		);
	}
});