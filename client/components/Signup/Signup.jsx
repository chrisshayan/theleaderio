const {SignupModel} = Meteor.TheLeader.formModels;

Signup = React.createClass({
	getInitialState() {
		return {
			isLoading: false,
			showRequestLink: false,
			errors: {}
		}
	},

	handleSubmit(e) {
		e.preventDefault();

		const {email, password, headline, firstname, lastname} = this.refs;
		const model = new SignupModel({
			firstname: firstname.getValue(),
			lastname: lastname.getValue(),
			email: email.getValue(),
			password: password.getValue(),
			headline: headline.getValue()
		});

		if (model.validate()) {
			this.setState({isLoading: true});
			Meteor.call('User.signup', model.raw(), (err, result = {}) => {
				const state = {
					isLoading: false,
					showRequestLink: false,
					errors: {}
				};
				if (result.code != LResponse.CODE.SUCCESS) {
					state.errors = result.details;

					if(state.errors.email && state.errors.email.match(/have to request an invitation/i)) {
						state.showRequestLink = true;
					}
					this.setState(state);
				} else {
					this.setState(state);
					Meteor.loginWithPassword({email: model.email}, model.password, (err) => {
						if(!err) {
							FlowRouter.go('App.home');
						}
					});
				}
			});
		} else {
			this.setState({
				isLoading: false,
				errors: model.getValidationErrors()
			})
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
					<div className="m-b text-sm">
						Sign up to your theLeader Account
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
						<FormInputMd ref="password" type="password" label="Password" errorMsg={this.state.errors.password}/>
						<FormInputMd ref="headline" type="text" label="Headline"
						             errorMsg={this.state.errors.headline}/>

						<button type="submit" className="md-btn md-raised pink btn-block p-h-md waves-effect">
							Sign up
						</button>
					</form>
				</div>

				<p id="alerts-container"></p>

				<div className="p-v-lg text-center">
					<div>
						Already have an account?
						<a href="/login" className="md-btn btn btn-link">Login</a>
						<br/>
						Or <a href="/request-invite" className="md-btn btn btn-link">Request an invitation</a>
					</div>
				</div>
			</div>
		);
	}
});