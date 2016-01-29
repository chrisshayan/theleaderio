const {RequestInvites} = Meteor.TheLeader.collections;

AdminRequestsContainer = React.createClass({
	mixins: [ReactMeteorData],
	getInitialState() {
		return {
			skip: 0,
			limit: 10
		}
	},
	getMeteorData() {
		const cond = [this.selector(), this.options()];
		const sub = Meteor.subscribe('RequestInvite.all', ...cond, 'requestInvitesCount');
		const cursor = RequestInvites.find(...cond);
		return {
			isLoading: !sub.ready(),
			items: cursor.fetch(),
			total: Counts.get('userCount')
		};
	},
	selector() {
		return {
		};
	},
	options() {
		return {
			limit: this.state.limit,
			skip: this.state.skip
		}
	},
	dataSource() {
		return this.data.items.map((r) => {
			return r.flat();
		});
	},
	columns() {
		return [
			{
				field: 'firstname',
				label: 'First name',
				type: 'text',
				width: 120,
				height: 30,
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
				width: 250,
				resizable: true
			},
			{
				field: 'headline',
				label: 'Headline',
				type: 'text',
				width: 200,
				resizable: true
			},
			{
				field: 'statusText',
				label: 'Status',
				type: 'text',
				width: 100,
				resizable: true
			},
			{
				field: 'actions',
				label: '',
				type: RequestInviteActions,
				width: 200,
				resizable: true
			}
		];
	},
	render() {
		return (
			<AdminRequestInvites
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