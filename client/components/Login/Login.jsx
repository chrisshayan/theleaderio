Login = React.createClass({
	getInitialState() {
		return {
			errors: {}
		}
	},

	handleSubmit(e) {
		e.preventDefault();
		Meteor.loginWithPassword(this.refs.email.getValue(), this.refs.password.getValue(), (err, result) => {
			if(err) {
				let reason = err.reason.toString().toLowerCase();
				if(reason.indexOf('email') >= 0 || reason.indexOf('user') >= 0) {
					this.setState({errors: {email: reason}});
				}
				if(reason.indexOf('password') >= 0) {
					this.setState({errors: {password: reason}});
				}
			}
		})
	},

	render() {
		return (
			<div className="center-block w-xxl w-auto-xs p-v-md">
				<div className="navbar">
					<div className="navbar-brand m-t-lg text-center">
						<span className="m-l inline">theLeader.io</span>
					</div>
				</div>

				<div className="p-lg panel md-whiteframe-z1 text-color m">
					<div className="m-b text-sm">
						Sign in with your theLeader Account
					</div>
					<form name="form" onSubmit={ this.handleSubmit }>
						<FormInputMd ref="email" type="email" label="Email" errorMsg={this.state.errors.email}/>
						<FormInputMd ref="password" type="password" label="Password" errorMsg={this.state.errors.password}/>

						<button type="submit" className="md-btn md-raised pink btn-block p-h-md waves-effect">
							Sign in
						</button>

						<div className="p-v-lg text-center">
							<div className="m-b">
								<a href="/forgot-password" className="md-btn">Forgot password?</a>
							</div>
							<div>Do not have an account?
								<a href="/request-invite" className="md-btn btn btn-link">
									Request an invitation
								</a>
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	}
});