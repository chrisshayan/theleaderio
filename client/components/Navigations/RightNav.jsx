RightNav = ({requests}) => (
	<div>
		<div className="modal fade" id="recent-activities" data-backdrop="true">
			<div className="right w-xl bg-white md-whiteframe-z2">
				<div className="box">
					<div className="p p-h-md">
						<a data-dismiss="modal" className="pull-right text-muted-lt text-2x m-t-n inline p-sm">×</a>
						<strong>Recent activities</strong>
					</div>
					<div className="box-row notifications-list">
						<div className="box-cell">
							<div className="box-inner">
								<div className="streamline b-l b-accent m-b">
									<div className="sl-item notification-item">
										<div className="sl-content">
											<div className="text-muted-dk timeago">4 minutes ago</div>
											<p className="info">
												<strong className="author">Ha Ngo</strong>
												{' '}
												<span className="text-muted subject">posted a feedback</span>
											</p>
											<p className="body">
												hi Chris dkdf dsf ...
											</p>
										</div>
									</div>

								</div>
							</div>
						</div>
					</div>
					<div className="p-h-md p-v">
						<button className="btn btn-link text-muted m-h btn-see-all">
							<i className="icon mdi-communication-clear-all i-20"></i>&nbsp; See all notifications
						</button>
					</div>
				</div>

			</div>
		</div>

		<div className="modal fade" id="recent-requests" data-backdrop="true">
			<div className="right w-xl bg-white md-whiteframe-z2">
				<div className="box">
					<div className="p p-h-md">
						<a data-dismiss="modal" className="pull-right text-muted-lt text-2x m-t-n inline p-sm">×</a>
						<strong>Requests</strong>
					</div>
					<div className="box-row requests-list">
						<div className="box-cell">
							<div className="box-inner">
								<RequestsList requests={requests} />
							</div>
						</div>
					</div>
					<div className="p-h-md p-v">
						<button className="btn btn-link text-muted m-h btn-see-all">
							<i className="icon mdi-communication-clear-all i-20"></i>&nbsp; See all requests
						</button>
					</div>
				</div>

			</div>
		</div>
	</div>
);