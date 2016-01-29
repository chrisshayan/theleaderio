const {RequestInvite} = Meteor.TheLeader.models;
const {Cell} = FixedDataTable;

RequestInviteActions = React.createClass({
	getInitialState() {
		return {
			isLoading: false
		}
	},

	request() {
		const {rowIndex, data} = this.props;
		return data[rowIndex] || {};
	},

	onClick(status, e) {
		e.preventDefault();
		const request = this.request();
		const data = {
			requestId: request._id,
			status: status
		};
		this.setState({isLoading: true});
		Meteor.call('RequestInvite.reply', data, (err, result) => {
			this.setState({isLoading: false});
		});
	},

	render() {
		const request = this.request();
		const buttons = [];
		switch (request.status) {
			case RequestInvite.STATUS.NEW:
			case RequestInvite.STATUS.REVOKED:
				buttons.push((
					<button
						className="btn btn-stroke btn-primary btn-sm"
						key={0}
						disabled={this.state.isLoading}
						onClick={(e) => this.onClick(RequestInvite.STATUS.APPROVED, e)}>
						Approve
					</button>
				));
				break;
			case RequestInvite.STATUS.APPROVED:
				buttons.push((
					<button
						className="btn btn-stroke btn-primary btn-sm"
						key={0}
						disabled={this.state.isLoading}
						onClick={(e) => this.onClick(RequestInvite.STATUS.REVOKED, e)}>
						Revoke
					</button>
				));
				break;
		}

		return (
			<Cell>
				{buttons}
			</Cell>
		);
	}
});