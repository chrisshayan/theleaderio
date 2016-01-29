TopNav = React.createClass({
	displayName: 'TopNav',

	componentDidMount() {
		$(this.refs.dropdown1).dropdown();
	},

	render() {
		return (
			<div className="navbar md-whiteframe-z1 no-radius indigo-500">
				<a md-ink-ripple="" data-toggle="modal" data-target="#aside"
				   className="navbar-item pull-left visible-xs visible-sm waves-effect">
					<i className="mdi-navigation-menu i-24"></i>
				</a>

				<div className="navbar-item pull-left h4">Page title</div>

				<ul className="nav nav-sm navbar-tool pull-right">
					<li>
						<a data-toggle="modal" data-target="#recent-requests" className=" waves-effect">
							<i className="icon mdi-social-people-outline i-24"></i>
							{/* Show badge if count > 0 */}
							{!!this.props.requestCounter && (
								<b className="badge bg-danger up">{this.props.requestCounter}</b>
							)}
						</a>
					</li>
					<li>
						<a data-toggle="modal" data-target="#recent-activities" className=" waves-effect">
							<i className="icon mdi-social-public i-24"></i>
							<b className="badge bg-danger up">13</b>
						</a>
					</li>

					<li className="dropdown">
						<a ref="dropdown1" className="waves-effect" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							<i className="mdi-navigation-more-vert i-24"></i>
						</a>
						<ul className="dropdown-menu dropdown-menu-scale pull-right pull-up text-color">
							<li><a href="/logout">Logout</a></li>
						</ul>
					</li>
				</ul>
				<div className="pull-right"></div>
			</div>
		);
	}
});