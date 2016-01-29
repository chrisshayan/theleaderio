ForgotPassword = React.createClass({
	getInitialState() {
		return {
			isLoading: false,
			sent: false,
			email: '',
			errors: {}
		}
	},

	handleSubmit(e) {
		e.preventDefault();
		const email = this.refs.email.getValue() || '';
		const model = new ForgotPasswordModel({email});
		if (model.validate()) {
			this.setState({isLoading: true, errors: {}});

			Accounts.forgotPassword({email}, (err, result) => {
				const newState = {
					sent: false,
					isLoading: false,
					email: email,
					errors: {}
				};
				if (err) {
					newState.errors['email'] = err.reason;
				} else {
					newState.sent = true;
				}
				this.setState(newState)
			});
		} else {
			this.setState({
				errors: model.getValidationErrors()
			});
		}
	},

	renderForm() {
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
						<p className="text-xs m-t">Enter your email address below and we will send you instructions on
							how to change your password.</p>
					</div>
					<form name="reset" onSubmit={ this.handleSubmit }>
						<FormInputMd
							ref="email"
							type="email"
							label="Email"
							errorMsg={this.state.errors.email}
							disabled={this.state.isLoading}/>

						<button
							type="submit"
							className="md-btn md-raised pink btn-block p-h-md waves-effect"
							disabled={this.state.isLoading}>
							Send
						</button>
					</form>

					<p id="alerts-container"></p>

					<div className="p-v-lg text-center">
						Return to <a href="/login" className="md-btn btn btn-link">login</a>
					</div>
				</div>
			</div>
		);
	},


	render() {
		if (this.state.sent) {
			return <SendInstruction email={this.state.email}/>
		} else {
			return this.renderForm();
		}
	}
});