const ResetPasswordModel = Astro.Class({
	name: 'ResetPasswordModel',
	fields: {
		password: {
			type: 'string',
			validator: [
				Validators.string(),
				Validators.required()
			]
		}
	}
});

ResetPassword = React.createClass({
	getInitialState() {
		return {
			isLoading: false,
			errors: {}
		}
	},

	handleSubmit(e) {
		e.preventDefault();
		const password = this.refs.password.getValue() || '';
		const model = new ResetPasswordModel({password});
		const token = FlowRouter.getParam('token');

		if(model.validate()) {
			this.setState({isLoading: true, errors: {}});

			Accounts.resetPassword(token, this.refs.password.getValue(), (err) => {
				if (err) {
					this.setState({
						errors: {
							password: err.reason
						},
						isLoading: false
					});
				} else {
					FlowRouter.go('/login');
				}

			});
		} else {
			this.setState({
				errors: model.getValidationErrors()
			});
		}
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
					<div className="m-b">
						Forgot your password?
						<p className="text-xs m-t">
							Enter your email address below and we will send you instructions on how to change your password.
						</p>
					</div>

					<form name="reset" onSubmit={ this.handleSubmit }>
						<FormInputMd
							ref="password"
							type="password"
							label="New password"
							errorMsg={this.state.errors.password} disabled={this.state.isLoading}/>

						<button
							type="submit"
							className="md-btn md-raised pink btn-block p-h-md waves-effect"
							disabled={this.state.isLoading} >
							Set password
						</button>
					</form>

					<div className="p-v-lg text-center">
						Return to <a href="/login" className="md-btn btn btn-link">login</a>
					</div>
				</div>
			</div>
		);
	}
});