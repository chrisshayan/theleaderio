SendInstruction = ({email}) => (
	<div className="center-block w-xxl w-auto-xs p-v-md">
		<div className="navbar">
			<div className="navbar-brand m-t-lg text-center">
				<span className="m-l inline">theLeader.io</span>
			</div>
		</div>

		<div className="p-lg panel md-whiteframe-z1 text-color m">
			<div className="m-b">
				Instructions sent
				<p className="text-xs m-t">
					Instructions for accessing your account have been sent to
					{' '}
					<b>{ email }</b>
				</p>
			</div>
		</div>
	</div>
);