LandingPage = ({currentUser}) => (
	<div>
		<h1>Landing Page</h1>
		{currentUser ? (
			<div>
				Hi <strong>{currentUser.defaultEmail()}</strong>
				<br/>
				<a href='/app' className="md-btn indigo md-raised p-h-lg waves-effect">
					<span className="text-white">Go to Dashboard</span>
				</a>
			</div>
		) : (
			<a href='/login' className="md-btn indigo md-raised p-h-lg waves-effect">
				<span className="text-white">Login</span>
			</a>
		)}
	</div>
);