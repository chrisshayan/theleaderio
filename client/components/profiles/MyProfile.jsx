const ProfileModel = Astro.Class({
	name: 'ProfileModel',
	fields: {
		firstname: {
			type: 'string',
			validator: [
				Validators.required()
			]
		},
		lastname: {
			type: 'string',
		},
		headline: {
			type: 'string',
		},
		bio: {
			type: 'string',
		},
		industries: {
			type: 'array',
			nested: 'string'
		}
	}
});

MyProfile = React.createClass({
	getInitialState() {
		return {
			isLoading: false,
			errors: {}
		}
	},

	handleSubmit(e) {
		e.preventDefault();

		const {firstname, lastname, headline, bio, industries} = this.refs;
		const model = new ProfileModel({
			firstname: firstname.getValue(),
			lastname: lastname.getValue(),
			headline: headline.getValue(),
			bio: bio.getValue()
		});

		if (model.validate()) {
			this.setState({
				isLoading: true,
				errors: {}
			});
			Meteor.call('User.profile.update', model.raw(), (err, result) => {
				this.setState({isLoading: false});
			});
		} else {
			this.setState({
				isLoading: false,
				errors: model.getValidationErrors()
			});
		}
	},

	render() {
		return (
			<div className="row">
				<div className="col-sm-10">
					<div className="box">

						<div className="col-md-9 b-l bg-white bg-auto">
							<div className="p-md bg-light lt b-b font-bold">Public profile</div>
							<form role="form" className="p-md col-md-6" onSubmit={this.handleSubmit}>
								<div className="form-group">
									<label>Profile picture</label>

									<div className="row">
										<div className="col-md-3 text-center">
											<a href="" className="w-xs inline">
												<img src="/images/a1.jpg" className="img-circle img-responsive"/>
											</a>
										</div>
									</div>

									<div className="form-file">
										<input type="file"/>
										<button className="btn btn-default">Upload new picture</button>
									</div>
								</div>
								<div className="form-group">
									<FormInputMd
										ref="firstname"
										label="First name"
										defaultValue={this.props.profile.firstname}
										errorMsg={this.state.errors.firstname}
										disabled={this.state.isLoading}/>
								</div>

								<div className="form-group">
									<FormInputMd
										ref="lastname"
										label="Last name"
										defaultValue={this.props.profile.lastname}
										errorMsg={this.state.errors.lastname}
										disabled={this.state.isLoading}/>
								</div>

								<div className="form-group">
									<FormInputMd
										ref="headline"
										label="Headline"
										defaultValue={this.props.profile.headline}
										errorMsg={this.state.errors.headline}
										disabled={this.state.isLoading}/>
								</div>

								<div className="form-group">
									<FormInputMd
										ref="bio"
										label="About"
										defaultValue={this.props.profile.bio}
										errorMsg={this.state.errors.bio}
										disabled={this.state.isLoading}/>
								</div>

								<div className="form-group">
									<label>Industries</label>
									<input type="text" className="form-control"/>
								</div>

								{this.state.isLoading ? (
									<button className="btn btn-info m-t" disabled>
										Saving...
									</button>
								) : (
									<button type="submit" className="btn btn-info m-t">
										Save
									</button>
								)}
							</form>
						</div>
					</div>
				</div>
			</div>

		);
	}
});