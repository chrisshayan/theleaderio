EmployeesItem = React.createClass({

	handleClickInvite(e) {
		const employee = this.props.user;
		const data = {
			employeeId: employee._id
		};
		Meteor.call('Request.invite.employee', data, (err, result) => {
			console.log(err, result)
		})
	},

	render() {
		const user = this.props.user;
		return (
			<li className="list-group-item clear">
				<a href="" className="pull-left w-40 m-r">
					<img src="/images/a1.jpg" className="img-responsive img-circle"/>
				</a>
				<div className="pull-right">
					<button className="btn" onClick={this.handleClickInvite}>Invite</button>
				</div>
				<div className="clear">
					<a href="" className="font-bold block">
						{user.fullname()}
						{' - '}
						{user.defaultEmail()}
					</a>
					{user.headline()}
				</div>
			</li>
		);
	}
});