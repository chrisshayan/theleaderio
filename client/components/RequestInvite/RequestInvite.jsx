const {RequestInviteModel} = Meteor.TheLeader.formModels;

RequestInvite = React.createClass({
	getInitialState() {
		return {
			isLoading: false,
			showRequestLink: false,
			errors: {},
			success: false,
		}
	},

	handleSubmit(e) {
		e.preventDefault();

		const {email, headline, firstname, lastname} = this.refs;
		const model = new RequestInviteModel({
			firstname: firstname.getValue(),
			lastname: lastname.getValue(),
			email: email.getValue(),
			headline: headline.getValue()
		});

		if (model.validate()) {
			this.setState({isLoading: true});
			Meteor.call('User.requestInvite', model.raw(), (err, result = {}) => {
				const state = {
					isLoading: false,
					showRequestLink: false,
					errors: {},
					success: false
				};
				if (result.code != LResponse.CODE.SUCCESS) {
					state.errors = result.details;
					this.setState(state);
				} else {
					state.success = true;
					this.setState(state);
				}
			});
		} else {
			this.setState({
				isLoading: false,
				errors: model.getValidationErrors()
			})
		}
	},

	renderSuccess() {
		return (
			<div className="center-block w-xxl p-v-md" style={{width: '400px'}}>
				<div className="navbar">
					<div className="navbar-brand m-t-lg text-center">
						<span className="m-l inline">theLeader.io</span>
					</div>
				</div>

				<div className="p-lg panel md-whiteframe-z1 text-color m">
					<div className="m-b">
						<h4>Thanks for requesting an invite.</h4>
						<p className="text-xs m-t">
							We'll send you one as soon as possible.
						</p>
					</div>
				</div>
			</div>
		);
	},

	render() {
		if(this.state.success) return this.renderSuccess();
		return (
			<div className="center-block w-xxl w-auto-xs p-v-md">
				<div className="navbar">
					<div className="navbar-brand m-t-lg text-center">
						<span className="m-l inline">theLeader.io</span>
					</div>
				</div>

				<div className="p-lg panel md-whiteframe-z1 text-color m">
					<div className="m-b text-sm">
						Request an invitation
					</div>
					<form name="form" onSubmit={ this.handleSubmit }>
						<div className="row row-sm">
							<div className="col-sm-6">
								<FormInputMd ref="firstname" type="text" label="First Name"
								             errorMsg={this.state.errors.firstname}/>
							</div>
							<div className="col-sm-6">
								<FormInputMd ref="lastname" type="text" label="Last Name"
								             errorMsg={this.state.errors.lastname}/>
							</div>
						</div>
						<FormInputMd ref="email" type="email" label="Email" errorMsg={this.state.errors.email}/>
						<FormInputMd ref="headline" type="text" label="Headline" errorMsg={this.state.errors.headline}/>

						<button type="submit" className="md-btn md-raised pink btn-block p-h-md waves-effect">
							Request
						</button>
					</form>
				</div>

				<p id="alerts-container"></p>

				<div className="p-v-lg text-center">
					<div>
						Already have an account?
						<a href="/login" className="md-btn btn btn-link">Login</a>
						<br/>
						Or <a href="/signup" className="md-btn btn btn-link">Sign up</a>
					</div>
				</div>
			</div>
		);
	}
});