RequestsListItem = React.createClass({

	handleAccept(e) {
		e.preventDefault();
		RequestActions.accept(this.props.request._id, function(err, res) {
			console.log(res)
		});
	},

	handleDeny(e) {
		e.preventDefault();
		RequestActions.deny(this.props.request._id, function(err, res) {
			console.log(res)
		});
	},

	render() {
		const request = this.props.request;
		return (
			<div className="sl-item request-item">
				<div className="sl-content">
					<div className="text-muted-dk timeago">4 minutes ago</div>
					<p className="info">
						<strong className="author">{ request.requester() }</strong>
						{' '}
						<span className="text-muted subject">{ request.subject() }</span>
					</p>
					<div className="body">
						<button className="md-btn md-flat m-b text-primary waves-effect" onClick={ this.handleAccept }>
							Accept
						</button>
						{' '}
						<button className="md-btn md-flat m-b waves-effect" onClick={ this.handleDeny }>
							Deny
						</button>
					</div>
				</div>
			</div>
		);
	}
})