FeedbackPage = ({items = [], isLoading=false, hasMore=false}) => (
	<div>
		<FeedbackPageHeader />

		<div className="row">
			<div className="col-sm-8">

				{/* Show loading icon */}
				{isLoading ? (
					<div className="text-center m-b i-24">
						<i className="fa fa-circle-o-notch fa-spin text-lg text-muted-lt"></i>
					</div>
				) : (
					_.isEmpty(items) ? (
						<h2 className="feedback-empty">There is no feedback</h2>
					) : (
						<FeedbackList items={items}/>
					)
				)}
				{/* Show load more btn */}
				{hasMore && (
					<div style="padding-bottom: 50px;">
						<button className="btn btn-block btn-primary waves-effect btn-more">
							<i className="icon mdi-navigation-expand-more i-24"></i>
							Load more
						</button>
					</div>
				)}
			</div>
		</div>
	</div>
);

FeedbackPageHeader = React.createClass({
	getInitialState() {
		return {
			isEditing: false,
		};
	},

	handleClickAdd(e) {
		this.setState({
			isEditing: true
		});
	},

	handleDiscard() {
		this.setState({
			isEditing: false
		});
	},

	handleSubmit(e) {
		e.preventDefault();
		const {content, point} = this.refs;

		//this.setState({
		//	isEditing: false
		//});
	},

	render() {
		return (
			<div className="row">
				<div className="col-sm-8">
					{!this.state.isEditing ? (
						<button className="md-btn md-raised m-b btn-fw indigo waves-effect pull-right" onClick={this.handleClickAdd}>
							<i className="mdi-editor-mode-edit i-16"/>
							{' '}
							Feedback
						</button>
					): (
						<div className="card">
							<div className="leader-info">
								<a href="" className="pull-left w-40 m-r">
									<img src="/images/a1.jpg" className="img-responsive img-circle"/>
								</a>

								<div className="clear">
									<a href="" className="font-bold block">Chris Shayan</a>

									<div className="text-xxs font-thin text-muted">Head of engineering</div>
								</div>
							</div>
							<form onSubmit={this.handleSubmit}>
								<textarea ref="content" className="form-control no-border p-md" rows="1" placeholder="Write something..."></textarea>
								<div className="lt p clear">
									<div className="row">
										<div className="col-sm-6">
											<div className="form-group">
												<label className="col-sm-2 control-label">Point</label>
												<div className="col-sm-10">
													<select ref="point" className="form-control" defaultValue={0}>
														{[5,4,3,2,1,0,-1,-2,-3,-4,-5].map((i, k) => (
															<option key={k} value={i}>{i}</option>
														))}
													</select>
												</div>
											</div>
										</div>
										<div className="col-sm-6">
											<button type="submit" className="md-btn md-raised pull-right p-h-md indigo waves-effect">
												Post
											</button>
											{' '}
											<button
												className="pull-right md-btn md-flat m-b btn-fw text-primary waves-effect"
												onClick={this.handleDiscard}>
												Cancel
											</button>
										</div>
									</div>
								</div>
							</form>
						</div>
					)}
				</div>
			</div>
		);
	}
});


FeedbackList = ({items}) => (
	<div>
		{items.map((item, key) => <FeedbackListItem key={key} feedback={item}/>)}
	</div>
);

FeedbackListItem = React.createClass({
	render() {
		const feedback = this.props.feedback;
		//const creator = feedback.creator();
		return (
			<div className="card">
				<div className="card-heading">
					<a href="" className="pull-left w-40 m-r">
						<img src="/images/a1.jpg" className="img-responsive img-circle"/>
					</a>

					<div className="clear">
						<a href="" className="font-bold block">Phu Nguyen</a>

						<div className="text-xxs font-thin text-muted">send feedback</div>
					</div>

					{feedback.point && (
						<a className="md-btn md-raised md-fab m-r md-fab-offset pull-right waves-effect feedback-point">
							{ feedback.point }
						</a>
					)}
				</div>

				<div className="card-body">
					<p>body content</p>
				</div>
			</div>
		);
	}
})