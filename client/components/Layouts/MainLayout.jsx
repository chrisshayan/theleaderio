MainLayout = ({ content = null, top = null, left = null, right = null }) => (
	<div className="app">
		{/* Left sidebar */}
		{left ? left : <LeftNavContainer />}

		{/* Content */}
		<div id="content" className="app-content" role="main">
			<div className="box">
				{/* Top bar */}
				{top ? top : <TopNavContainer />}

				<div className="box-row">
					<div className="box-cell">
						<div className="box-inner padding">
							{ content }
						</div>
					</div>
				</div>
			</div>
		</div>

		{/* Right Nav */}
		{right ? right : <RightNavContainer />}
	</div>
);