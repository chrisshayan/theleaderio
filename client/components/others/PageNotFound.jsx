PageNotFound = React.createClass({
	render() {
		return (
			<div className="amber-200 bg-big">
				<div className="text-center">
					<h1 className="text-shadow no-margin text-white text-4x p-v-lg">
						<span className="text-2x font-bold m-t-lg block">404</span>
					</h1>
					<h2 className="h1 m-v-lg text-black">OOPS!</h2>
					<p className="h4 m-v-lg text-u-c font-bold text-black">Sorry! the page you are looking for doesn't exist.</p>
					<div className="p-v-lg">
						<a href='/' className="md-btn indigo md-raised p-h-lg waves-effect">
							<span className="text-white">Go to the home page</span>
						</a>
					</div>
				</div>
			</div>
		);
	}
});